const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pool = require('../db/pool');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { sendInquiryNotification, sendInquiryConfirmation } = require('../services/email');

const router = express.Router();

// Rate limit: 5 submissions per 15 min per IP
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions — please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const inquiryValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('phone').trim().notEmpty().withMessage('Phone is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('service').trim().notEmpty().withMessage('Service selection is required').escape(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters').escape(),
  body('preferred_date').optional({ checkFalsy: true }).isDate().withMessage('Invalid date format'),
  body('honeypot').custom((val) => {
    if (val) throw new Error('Bot detected');
    return true;
  }),
];

// POST /api/inquiries — public, rate-limited
router.post('/', submitLimiter, inquiryValidators, validate, async (req, res) => {
  const { name, phone, email, service, preferred_date, message } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO inquiries (name, phone, email, service, preferred_date, message)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, phone, email, service, preferred_date || null, message]
  );

  const inquiry = rows[0];

  // Fire emails asynchronously — don't fail the response if email fails
  Promise.all([
    sendInquiryNotification(inquiry).catch((e) => console.error('Admin email failed:', e.message)),
    sendInquiryConfirmation(inquiry).catch((e) => console.error('Client email failed:', e.message)),
  ]);

  res.status(201).json({ success: true, id: inquiry.id });
});

// GET /api/inquiries — admin only
router.get('/', requireAuth, async (req, res) => {
  const { status, service, from, to, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [];

  if (status) { params.push(status); conditions.push(`status = $${params.length}`); }
  if (service) { params.push(`%${service}%`); conditions.push(`service ILIKE $${params.length}`); }
  if (from) { params.push(from); conditions.push(`created_at >= $${params.length}`); }
  if (to) { params.push(to); conditions.push(`created_at <= $${params.length}::date + interval '1 day'`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(Number(limit), Number(offset));
  const { rows } = await pool.query(
    `SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) FROM inquiries ${where}`,
    params.slice(0, -2)
  );

  res.json({ data: rows, total: Number(countRows[0].count), page: Number(page), limit: Number(limit) });
});

// PATCH /api/inquiries/:id — update status or notes
router.patch('/:id', requireAuth, async (req, res) => {
  const { status, notes } = req.body;
  const allowed = ['new', 'read', 'contacted', 'closed'];
  if (status && !allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const { rows } = await pool.query(
    `UPDATE inquiries SET
       status = COALESCE($1, status),
       notes  = COALESCE($2, notes)
     WHERE id = $3 RETURNING *`,
    [status || null, notes || null, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE /api/inquiries/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

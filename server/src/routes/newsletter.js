const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pool = require('../db/pool');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { sendNewsletterWelcome } = require('../services/email');

const router = express.Router();

const signupLimiter = rateLimit({ windowMs: 60 * 1000, max: 3 });

// POST /api/newsletter/subscribe — public
router.post(
  '/subscribe',
  signupLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('name').optional().trim().escape(),
  ],
  validate,
  async (req, res) => {
    const { email, name } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO subscribers (email, name) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET status = 'active' RETURNING *`,
      [email, name || null]
    );
    sendNewsletterWelcome(email, name).catch(() => {});
    res.status(201).json({ success: true });
  }
);

// GET /api/newsletter/subscribers — admin
router.get('/subscribers', requireAuth, async (req, res) => {
  const { status } = req.query;
  const { rows } = await pool.query(
    status
      ? 'SELECT * FROM subscribers WHERE status = $1 ORDER BY subscribed_at DESC'
      : 'SELECT * FROM subscribers ORDER BY subscribed_at DESC',
    status ? [status] : []
  );
  res.json({ data: rows });
});

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', [body('email').isEmail().normalizeEmail()], validate, async (req, res) => {
  await pool.query('UPDATE subscribers SET status = $1 WHERE email = $2', ['unsubscribed', req.body.email]);
  res.json({ success: true });
});

module.exports = router;

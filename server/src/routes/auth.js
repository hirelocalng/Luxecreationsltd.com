const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const pool = require('../db/pool');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts — try again in 15 minutes.' },
});

// POST /api/auth/setup — one-time admin seed (run once, then disable or protect)
router.post('/setup', async (req, res) => {
  const { rows } = await pool.query('SELECT COUNT(*) FROM admins');
  if (Number(rows[0].count) > 0) {
    return res.status(403).json({ error: 'Admin already exists' });
  }

  const email = process.env.ADMIN_EMAIL_INIT;
  const password = process.env.ADMIN_PASSWORD_INIT;
  if (!email || !password) {
    return res.status(400).json({ error: 'ADMIN_EMAIL_INIT and ADMIN_PASSWORD_INIT env vars required' });
  }

  const hash = await bcrypt.hash(password, 12);
  await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [email, hash]);
  res.json({ success: true, message: 'Admin created — change your password immediately' });
});

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  }
);

// POST /api/auth/change-password
router.post(
  '/change-password',
  requireAuth,
  [
    body('current_password').notEmpty(),
    body('new_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  async (req, res) => {
    const { current_password, new_password } = req.body;
    const { rows } = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(current_password, admin.password))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hash = await bcrypt.hash(new_password, 12);
    await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [hash, req.admin.id]);
    res.json({ success: true });
  }
);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const pool = require('../db/pool');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials — public, published only
router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, role, division, quote, rating FROM testimonials WHERE published = TRUE ORDER BY sort_order ASC, id ASC'
  );
  res.json({ data: rows });
});

// GET /api/testimonials/admin — all (admin)
router.get('/admin', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY sort_order ASC, id ASC');
  res.json({ data: rows });
});

// POST /api/testimonials
router.post('/', requireAuth, [
  body('name').trim().notEmpty(),
  body('quote').trim().notEmpty(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
], validate, async (req, res) => {
  const { name, role, division, quote, rating = 5, published = true } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO testimonials (name, role, division, quote, rating, published)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, role || null, division || null, quote, rating, published]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/testimonials/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { name, role, division, quote, rating, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE testimonials SET
       name = COALESCE($1, name), role = COALESCE($2, role), division = COALESCE($3, division),
       quote = COALESCE($4, quote), rating = COALESCE($5, rating),
       sort_order = COALESCE($6, sort_order), published = COALESCE($7, published)
     WHERE id = $8 RETURNING *`,
    [name, role, division, quote, rating, sort_order, published, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// PATCH /api/testimonials/reorder — bulk update sort_order
router.patch('/reorder', requireAuth, async (req, res) => {
  const { order } = req.body; // [{ id: 1, sort_order: 0 }, ...]
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });
  await Promise.all(
    order.map(({ id, sort_order }) =>
      pool.query('UPDATE testimonials SET sort_order = $1 WHERE id = $2', [sort_order, id])
    )
  );
  res.json({ success: true });
});

// DELETE /api/testimonials/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

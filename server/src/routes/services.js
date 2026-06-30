const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/services — public
router.get('/', async (req, res) => {
  const { division } = req.query;
  const { rows } = await pool.query(
    division
      ? 'SELECT * FROM services WHERE active = TRUE AND division = $1 ORDER BY sort_order ASC'
      : 'SELECT * FROM services WHERE active = TRUE ORDER BY division ASC, sort_order ASC',
    division ? [division] : []
  );
  res.json({ data: rows });
});

// POST /api/services
router.post('/', requireAuth, async (req, res) => {
  const { division, title, description, sort_order = 0, active = true } = req.body;
  if (!division || !title) return res.status(400).json({ error: 'division and title required' });
  const { rows } = await pool.query(
    'INSERT INTO services (division, title, description, sort_order, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [division, title, description || null, sort_order, active]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/services/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { division, title, description, sort_order, active } = req.body;
  const { rows } = await pool.query(
    `UPDATE services SET
       division = COALESCE($1, division), title = COALESCE($2, title),
       description = COALESCE($3, description), sort_order = COALESCE($4, sort_order),
       active = COALESCE($5, active)
     WHERE id = $6 RETURNING *`,
    [division, title, description, sort_order, active, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE /api/services/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

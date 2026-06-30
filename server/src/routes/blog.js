const express = require('express');
const { body } = require('express-validator');
const slugify = require('slugify');
const pool = require('../db/pool');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const postValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').optional(),
  body('excerpt').optional().trim(),
  body('featured_image').optional().isURL().withMessage('Invalid image URL'),
  body('meta_title').optional().trim(),
  body('meta_description').optional().trim(),
  body('status').optional().isIn(['draft', 'published']),
];

// GET /api/blog — public listing of published posts
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const { rows } = await pool.query(
    `SELECT id, title, slug, excerpt, featured_image, meta_title, meta_description, published_at, created_at
     FROM posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST LIMIT $1 OFFSET $2`,
    [Number(limit), Number(offset)]
  );
  const { rows: countRows } = await pool.query("SELECT COUNT(*) FROM posts WHERE status = 'published'");
  res.json({ data: rows, total: Number(countRows[0].count) });
});

// GET /api/blog/admin — admin listing (all statuses)
router.get('/admin', requireAuth, async (req, res) => {
  const { status } = req.query;
  const { rows } = await pool.query(
    status
      ? 'SELECT * FROM posts WHERE status = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM posts ORDER BY created_at DESC',
    status ? [status] : []
  );
  res.json({ data: rows });
});

// GET /api/blog/:slug — public single post
router.get('/:slug', async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE slug = $1 AND status = 'published'",
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'Post not found' });
  res.json(rows[0]);
});

// POST /api/blog — admin create
router.post('/', requireAuth, postValidators, validate, async (req, res) => {
  const { title, content, excerpt, featured_image, meta_title, meta_description, status = 'draft' } = req.body;
  const slug = slugify(title, { lower: true, strict: true });

  const { rows } = await pool.query(
    `INSERT INTO posts (title, slug, content, excerpt, featured_image, meta_title, meta_description, status, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, slug, content || null, excerpt || null, featured_image || null,
     meta_title || title, meta_description || excerpt || null, status,
     status === 'published' ? new Date() : null]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/blog/:id — admin update
router.put('/:id', requireAuth, postValidators, validate, async (req, res) => {
  const { title, content, excerpt, featured_image, meta_title, meta_description, status } = req.body;
  const { rows: existing } = await pool.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
  if (!existing.length) return res.status(404).json({ error: 'Not found' });

  const post = existing[0];
  const newSlug = title ? slugify(title, { lower: true, strict: true }) : post.slug;
  const wasPublished = post.status !== 'published' && status === 'published';

  const { rows } = await pool.query(
    `UPDATE posts SET
       title = COALESCE($1, title),
       slug  = $2,
       content = COALESCE($3, content),
       excerpt = COALESCE($4, excerpt),
       featured_image = COALESCE($5, featured_image),
       meta_title = COALESCE($6, meta_title),
       meta_description = COALESCE($7, meta_description),
       status = COALESCE($8, status),
       published_at = CASE WHEN $9 THEN NOW() ELSE published_at END,
       updated_at = NOW()
     WHERE id = $10 RETURNING *`,
    [title, newSlug, content, excerpt, featured_image, meta_title, meta_description, status, wasPublished, req.params.id]
  );
  res.json(rows[0]);
});

// DELETE /api/blog/:id — admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

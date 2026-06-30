const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store upload in memory before sending to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  },
});

// GET /api/portfolio — public
router.get('/', async (req, res) => {
  const { category } = req.query;
  const { rows } = await pool.query(
    category
      ? 'SELECT * FROM portfolio_items WHERE published = TRUE AND category = $1 ORDER BY sort_order ASC, id DESC'
      : 'SELECT * FROM portfolio_items WHERE published = TRUE ORDER BY sort_order ASC, id DESC',
    category ? [category] : []
  );
  res.json({ data: rows });
});

// GET /api/portfolio/admin
router.get('/admin', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM portfolio_items ORDER BY sort_order ASC, id DESC');
  res.json({ data: rows });
});

// POST /api/portfolio — admin upload
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image file required' });
  const { title, category, sort_order = 0, published = true } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'title and category required' });

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'luxe-creations/portfolio', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(req.file.buffer);
  });

  const { rows } = await pool.query(
    `INSERT INTO portfolio_items (title, category, image_url, cloudinary_id, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, category, result.secure_url, result.public_id, sort_order, published === 'true']
  );
  res.status(201).json(rows[0]);
});

// PUT /api/portfolio/:id — update metadata (not image)
router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE portfolio_items SET
       title = COALESCE($1, title), category = COALESCE($2, category),
       sort_order = COALESCE($3, sort_order), published = COALESCE($4, published)
     WHERE id = $5 RETURNING *`,
    [title, category, sort_order, published, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE /api/portfolio/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM portfolio_items WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const item = rows[0];

  // Delete from Cloudinary
  if (item.cloudinary_id) {
    await cloudinary.uploader.destroy(item.cloudinary_id).catch(() => {});
  }

  await pool.query('DELETE FROM portfolio_items WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

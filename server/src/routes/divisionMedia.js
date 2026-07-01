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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB for videos
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Images and videos only'));
    }
  },
});

// GET /api/division-media?division=events&published=true — public
router.get('/', async (req, res) => {
  const { division, published } = req.query;
  let query = 'SELECT * FROM division_media WHERE 1=1';
  const params = [];

  if (division) {
    params.push(division.toLowerCase());
    query += ` AND LOWER(division) = $${params.length}`;
  }
  if (published === 'true') {
    query += ' AND published = TRUE';
  }
  query += ' ORDER BY sort_order ASC, id DESC';

  const { rows } = await pool.query(query, params);
  res.json({ data: rows });
});

// GET /api/division-media/admin?division=events — admin
router.get('/admin', requireAuth, async (req, res) => {
  const { division } = req.query;
  let query = 'SELECT * FROM division_media';
  const params = [];
  if (division) {
    params.push(division.toLowerCase());
    query += ' WHERE LOWER(division) = $1';
  }
  query += ' ORDER BY sort_order ASC, id DESC';
  const { rows } = await pool.query(query, params);
  res.json({ data: rows });
});

// POST /api/division-media — admin upload
router.post('/', requireAuth, upload.single('media'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Media file required' });
  const { division, title, sort_order = 0 } = req.body;
  if (!division) return res.status(400).json({ error: 'division required' });

  const isVideo = req.file.mimetype.startsWith('video/');

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `luxe-creations/division-media/${division.toLowerCase()}`,
        resource_type: 'auto',
      },
      (err, r) => (err ? reject(err) : resolve(r))
    );
    stream.end(req.file.buffer);
  });

  const thumbnailUrl = isVideo
    ? result.secure_url
        .replace('/upload/', '/upload/so_0,f_jpg/')
        .replace(/\.[^/.]+$/, '.jpg')
    : result.secure_url;

  const { rows } = await pool.query(
    `INSERT INTO division_media
       (division, title, media_url, thumbnail_url, cloudinary_id, media_type, sort_order, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE) RETURNING *`,
    [
      division.toLowerCase(),
      title || null,
      result.secure_url,
      thumbnailUrl,
      result.public_id,
      isVideo ? 'video' : 'image',
      Number(sort_order) || 0,
    ]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/division-media/:id — update metadata
router.put('/:id', requireAuth, async (req, res) => {
  const { title, sort_order, published } = req.body;
  const { rows } = await pool.query(
    `UPDATE division_media SET
       title = COALESCE($1, title),
       sort_order = COALESCE($2, sort_order),
       published = COALESCE($3, published)
     WHERE id = $4 RETURNING *`,
    [title ?? null, sort_order ?? null, published ?? null, req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// DELETE /api/division-media/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM division_media WHERE id = $1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  const item = rows[0];

  if (item.cloudinary_id) {
    await cloudinary.uploader
      .destroy(item.cloudinary_id, {
        resource_type: item.media_type === 'video' ? 'video' : 'image',
      })
      .catch(() => {});
  }

  await pool.query('DELETE FROM division_media WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;

const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/seo — public (used by frontend for <head> tags)
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM seo_settings ORDER BY page_key');
  res.json({ data: rows });
});

// GET /api/seo/:page
router.get('/:page', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM seo_settings WHERE page_key = $1', [req.params.page]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// PUT /api/seo/:page — admin update
router.put('/:page', requireAuth, async (req, res) => {
  const { meta_title, meta_description } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO seo_settings (page_key, meta_title, meta_description, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (page_key) DO UPDATE SET
       meta_title = EXCLUDED.meta_title,
       meta_description = EXCLUDED.meta_description,
       updated_at = NOW()
     RETURNING *`,
    [req.params.page, meta_title, meta_description]
  );
  res.json(rows[0]);
});

// GET /api/seo/sitemap.xml — public XML sitemap
router.get('/sitemap.xml', async (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://luxecreationsltd.com';
  const { rows: posts } = await pool.query(
    "SELECT slug, updated_at FROM posts WHERE status = 'published'"
  );

  const staticPages = [
    { loc: baseUrl, priority: '1.0' },
    { loc: `${baseUrl}/#about`, priority: '0.8' },
    { loc: `${baseUrl}/#events`, priority: '0.8' },
    { loc: `${baseUrl}/#confectioneries`, priority: '0.8' },
    { loc: `${baseUrl}/#designs`, priority: '0.8' },
    { loc: `${baseUrl}/#portfolio`, priority: '0.7' },
    { loc: `${baseUrl}/#contact`, priority: '0.9' },
    { loc: `${baseUrl}/blog`, priority: '0.6' },
  ];

  const postUrls = posts.map((p) => ({
    loc: `${baseUrl}/blog/${p.slug}`,
    lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : undefined,
    priority: '0.6',
  }));

  const allUrls = [...staticPages, ...postUrls];
  const urls = allUrls
    .map(({ loc, lastmod, priority }) =>
      `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  res.set('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ── 1. Static files FIRST — no auth, no rate-limit, no CORS interference ─────
const DIST = path.join(__dirname, '../../dist');
app.use(express.static(DIST));

// ── 2. Security headers (CSP disabled — React SPA uses inline scripts) ────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: false,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── 3. CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      'https://luxecreationsltd.com',
      'https://www.luxecreationsltd.com',
      'https://luxecreationsltdcom-production.up.railway.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── 4. Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ── 5. Global rate limit (API only) ──────────────────────────────────────────
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests — please slow down.' },
  })
);

// ── 6. API routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/inquiries',   require('./routes/inquiries'));
app.use('/api/blog',        require('./routes/blog'));
app.use('/api/testimonials',require('./routes/testimonials'));
app.use('/api/services',    require('./routes/services'));
app.use('/api/portfolio',   require('./routes/portfolio'));
app.use('/api/newsletter',  require('./routes/newsletter'));
app.use('/api/seo',         require('./routes/seo'));

// ── 7. Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 8. Catch-all — serve React app for all non-API, non-asset routes ─────────
app.get('*splat', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

// ── Error handler ─────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists.' });
  }
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`✅ Luxe Creations API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

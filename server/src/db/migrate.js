require('dotenv').config();
const pool = require('./pool');

const schema = `
-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id          SERIAL PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Contact / booking inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  email          TEXT NOT NULL,
  service        TEXT NOT NULL,
  preferred_date DATE,
  message        TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'new',  -- new | read | contacted | closed
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id           SERIAL PRIMARY KEY,
  email        TEXT UNIQUE NOT NULL,
  name         TEXT,
  status       TEXT NOT NULL DEFAULT 'active', -- active | unsubscribed
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT,
  division   TEXT,
  quote      TEXT NOT NULL,
  rating     INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order INTEGER DEFAULT 0,
  published  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service descriptions (per division)
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  division    TEXT NOT NULL,  -- events | confectioneries | designs
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE
);

-- Portfolio images
CREATE TABLE IF NOT EXISTS portfolio_items (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  category       TEXT NOT NULL, -- Events | Confectioneries | Branding & Design
  image_url      TEXT NOT NULL,
  cloudinary_id  TEXT,
  sort_order     INTEGER DEFAULT 0,
  published      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS posts (
  id               SERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  content          TEXT,
  excerpt          TEXT,
  featured_image   TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  status           TEXT NOT NULL DEFAULT 'draft', -- draft | published
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- SEO settings per page
CREATE TABLE IF NOT EXISTS seo_settings (
  id               SERIAL PRIMARY KEY,
  page_key         TEXT UNIQUE NOT NULL, -- home | about | events | etc.
  meta_title       TEXT,
  meta_description TEXT,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default SEO rows
INSERT INTO seo_settings (page_key, meta_title, meta_description) VALUES
  ('home',           'Luxe Creations Ltd — Events, Confectioneries & Design', 'Premium creative lifestyle brand in Onitsha, Anambra State. Luxury event planning, bespoke cakes, and impactful brand design.'),
  ('about',          'About Us — Luxe Creations Ltd', 'Learn about our mission, vision, and creative team at Luxe Creations Ltd.'),
  ('events',         'Luxe Events — Luxury Event Planning', 'Bespoke wedding, corporate, and celebration event planning across Nigeria.'),
  ('confectioneries','Luxe Confectioneries — Custom Cakes & Pastries', 'Artisan custom cakes, dessert tables, and bespoke confections for every occasion.'),
  ('designs',        'Luxe Designs — Brand Identity & Visual Design', 'Logo design, brand identity, and visual content for businesses across Nigeria.'),
  ('portfolio',      'Portfolio — Luxe Creations Ltd', 'Browse our portfolio of luxury events, bespoke cakes, and brand identity projects.'),
  ('blog',           'Blog — Luxe Creations Ltd', 'Tips, inspiration, and behind-the-scenes from Luxe Creations Ltd.')
ON CONFLICT (page_key) DO NOTHING;
`;

async function migrate() {
  console.log('Running migrations...');
  try {
    await pool.query(schema);
    console.log('✅ Migration complete');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

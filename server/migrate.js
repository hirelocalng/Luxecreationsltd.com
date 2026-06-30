// Standalone migration script — run with: node server/migrate.js
// Works from repo root or from server/ directory.
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const schema = `
-- Admin users
CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
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
  status         TEXT NOT NULL DEFAULT 'new',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  status        TEXT NOT NULL DEFAULT 'active',
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

-- Service listings per division
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  division    TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE
);

-- Portfolio images (hosted on Cloudinary)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  cloudinary_id TEXT,
  sort_order    INTEGER DEFAULT 0,
  published     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
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
  status           TEXT NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- SEO settings per page
CREATE TABLE IF NOT EXISTS seo_settings (
  id               SERIAL PRIMARY KEY,
  page_key         TEXT UNIQUE NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Seed SEO defaults
INSERT INTO seo_settings (page_key, meta_title, meta_description) VALUES
  ('home',           'Luxe Creations Ltd — Events, Confectioneries & Design',  'Premium creative lifestyle brand in Onitsha, Anambra State. Luxury event planning, bespoke cakes, and impactful brand design.'),
  ('about',          'About Us — Luxe Creations Ltd',                          'Learn about our mission, vision, and creative team at Luxe Creations Ltd.'),
  ('events',         'Luxe Events — Luxury Event Planning',                    'Bespoke wedding, corporate, and celebration event planning across Nigeria.'),
  ('confectioneries','Luxe Confectioneries — Custom Cakes & Pastries',         'Artisan custom cakes, dessert tables, and bespoke confections for every occasion.'),
  ('designs',        'Luxe Designs — Brand Identity & Visual Design',          'Logo design, brand identity, and visual content for businesses across Nigeria.'),
  ('portfolio',      'Portfolio — Luxe Creations Ltd',                         'Browse our portfolio of luxury events, bespoke cakes, and brand identity projects.'),
  ('blog',           'Blog — Luxe Creations Ltd',                              'Tips, inspiration, and behind-the-scenes from Luxe Creations Ltd.')
ON CONFLICT (page_key) DO NOTHING;

-- Seed services (only if table is empty)
INSERT INTO services (division, title, sort_order, active)
SELECT division, title, sort_order, active FROM (VALUES
  ('events',          'Wedding & Reception Planning',              1,  true),
  ('events',          'Traditional Marriage Ceremony',             2,  true),
  ('events',          'Corporate Events & Conferences',            3,  true),
  ('events',          'Birthday & Anniversary Celebrations',       4,  true),
  ('events',          'Naming & Thanksgiving Ceremonies',          5,  true),
  ('events',          'Bridal Showers & Bachelor Parties',         6,  true),
  ('events',          'Venue Sourcing & Decoration',               7,  true),
  ('events',          'Catering & Vendor Coordination',            8,  true),
  ('events',          'Event Photography & Videography Liaison',   9,  true),
  ('events',          'Full Day-of Coordination',                  10, true),
  ('confectioneries', 'Custom Wedding Cakes',                      1,  true),
  ('confectioneries', 'Birthday & Celebration Cakes',              2,  true),
  ('confectioneries', 'Cupcakes & Mini Cakes',                     3,  true),
  ('confectioneries', 'Dessert Tables & Candy Buffets',            4,  true),
  ('confectioneries', 'Fondant & Sculpted Cakes',                  5,  true),
  ('confectioneries', 'Corporate Branded Cakes',                   6,  true),
  ('confectioneries', 'Pastries & Small Chops',                    7,  true),
  ('confectioneries', 'Cake Tasting Consultations',                8,  true),
  ('designs',         'Brand Identity & Logo Design',              1,  true),
  ('designs',         'Color Palette & Typography Systems',        2,  true),
  ('designs',         'Stationery & Print Design',                 3,  true),
  ('designs',         'Event Branding & Signage',                  4,  true),
  ('designs',         'Social Media Graphics & Templates',         5,  true),
  ('designs',         'Marketing Collateral & Flyers',             6,  true),
  ('designs',         'Packaging Design',                          7,  true),
  ('designs',         'Brand Guidelines & Style Guides',           8,  true)
) AS v(division, title, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- Seed testimonials (only if table is empty)
INSERT INTO testimonials (name, role, division, quote, rating, sort_order, published)
SELECT name, role, division, quote, rating, sort_order, published FROM (VALUES
  ('Adaeze Okonkwo',   'Bride, Enugu 2024',           'events',          'Luxe Creations transformed our wedding into a dream. Every detail was perfection — from the breathtaking decor to the seamless coordination. Our guests are still talking about it.', 5, 1, true),
  ('Chidi & Ngozi Eze','Anniversary Couple, Onitsha', 'confectioneries', 'The five-tier cake was nothing short of a masterpiece. It tasted as incredible as it looked. Luxe Confectioneries has ruined us for any other bakery forever.',                   5, 2, true),
  ('Emeka Obi',        'CEO, Obi Holdings',            'designs',         'Our rebrand with Luxe Designs elevated our entire company image. The logo, colour palette, and brand materials they delivered were world-class. Our clients noticed immediately.',    5, 3, true)
) AS v(name, role, division, quote, rating, sort_order, published)
WHERE NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1);
`;

async function migrate() {
  console.log('🔄 Connecting to database…');
  try {
    await pool.query(schema);
    console.log('✅ Migration complete — all tables created, seed data loaded');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

const FILTERS = ['All', 'Events', 'Confectioneries', 'Branding & Design'];

// Normalize lowercase API category → display label
const CAT_MAP = {
  events:           'Events',
  confectioneries:  'Confectioneries',
  designs:          'Branding & Design',
  'branding & design': 'Branding & Design',
  other:            'Events', // fallback grouping
};

function normalizeCategory(cat) {
  if (!cat) return 'Events';
  return CAT_MAP[cat.toLowerCase()] ?? cat;
}

// Accent colour per display category
const ACCENT = {
  'Events':           '#D9A521',
  'Confectioneries':  '#C97B5E',
  'Branding & Design':'#D9A521',
};

// Gradient fallback shown when no image_url is set
const GRADIENTS = {
  'Events': [
    'linear-gradient(135deg, #1a4033 0%, #2d6a4f 100%)',
    'linear-gradient(135deg, #1c2d1a 0%, #2e5c28 100%)',
    'linear-gradient(135deg, #2d2a1a 0%, #6b5c22 100%)',
    'linear-gradient(135deg, #0e2a2a 0%, #1a5050 100%)',
  ],
  'Confectioneries': [
    'linear-gradient(135deg, #3d1c0d 0%, #7a3d22 100%)',
    'linear-gradient(135deg, #2d1a1a 0%, #6b3535 100%)',
    'linear-gradient(135deg, #2a1a2d 0%, #5c226b 100%)',
    'linear-gradient(135deg, #2d1a26 0%, #5c3350 100%)',
  ],
  'Branding & Design': [
    'linear-gradient(135deg, #0B2B22 0%, #1a5040 100%)',
    'linear-gradient(135deg, #1a1a3d 0%, #2e2e6b 100%)',
    'linear-gradient(135deg, #1a2a1a 0%, #2a5c2a 100%)',
    'linear-gradient(135deg, #1a2d2a 0%, #2d5c55 100%)',
  ],
};

function gradientFor(displayCategory, index) {
  const pool = GRADIENTS[displayCategory] ?? GRADIENTS['Events'];
  return pool[index % pool.length];
}

// Fallback shown while API loads or when backend is unreachable
const FALLBACK_ITEMS = [
  { id: 'f1',  title: 'Royal Garden Wedding Reception',      category: 'Events' },
  { id: 'f2',  title: 'Artisan Five-Tier Wedding Cake',      category: 'Confectioneries' },
  { id: 'f3',  title: 'Zenith Capital — Brand Identity',     category: 'Branding & Design' },
  { id: 'f4',  title: 'Corporate Gala — 300 Guests',         category: 'Events' },
  { id: 'f5',  title: 'Rose Gold Birthday Celebration Cake', category: 'Confectioneries' },
  { id: 'f6',  title: 'Lumina Boutique — Visual Identity',   category: 'Branding & Design' },
  { id: 'f7',  title: 'Luxury Baby Shower — Ivory & Gold',   category: 'Events' },
  { id: 'f8',  title: 'Dessert Table — 80-Piece Collection', category: 'Confectioneries' },
  { id: 'f9',  title: 'Nkemjika Foods — Packaging Design',   category: 'Branding & Design' },
  { id: 'f10', title: 'Product Launch — 500 Attendees',      category: 'Events' },
  { id: 'f11', title: 'Bridal Shower Cake & Cupcakes',       category: 'Confectioneries' },
  { id: 'f12', title: 'Solace Wellness — Brand System',      category: 'Branding & Design' },
];

function PortfolioCard({ item, index }) {
  const displayCat = normalizeCategory(item.category);
  const accent     = ACCENT[displayCat] ?? '#D9A521';
  const gradient   = gradientFor(displayCat, index);
  const hasImage   = Boolean(item.image_url);

  return (
    <div
      className="portfolio-card"
      style={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        aspectRatio: '4/3',
        minHeight: 280,
        background: hasImage ? '#0B2B22' : gradient,
        cursor: 'pointer',
      }}
    >
      {/* Uploaded image */}
      {hasImage && (
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      )}

      {/* Dot pattern (placeholder-only cards) */}
      {!hasImage && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
      )}

      {/* Label overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 22,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 5,
          }}
        >
          {displayCat}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 600,
            color: '#F7F3E8',
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        className="portfolio-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11,43,34,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#D9A521',
            border: '1px solid #D9A521',
            padding: '10px 20px',
            borderRadius: 2,
          }}
        >
          View Project
        </span>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: 4,
        overflow: 'hidden',
        aspectRatio: '4/3',
        minHeight: 280,
        background: 'linear-gradient(135deg, rgba(11,43,34,0.08) 0%, rgba(11,43,34,0.18) 100%)',
        animation: 'skeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

export default function Portfolio({ preview = false }) {
  const [active, setActive] = useState('All');
  const ref     = useScrollReveal();
  const gridRef = useRef(null);

  const { items, loading } = useFetch(api.getPortfolio, FALLBACK_ITEMS);

  // Normalize categories on incoming API items so filter/display works correctly
  const normalizedItems = items.map(item => ({
    ...item,
    _displayCategory: normalizeCategory(item.category),
  }));

  const filtered =
    active === 'All'
      ? normalizedItems
      : normalizedItems.filter(i => i._displayCategory === active);

  // In preview mode show at most 6 items, no filter pills
  const displayed = preview ? filtered.slice(0, 6) : filtered;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || loading) return;
    const cards = grid.querySelectorAll('.portfolio-card');
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });
    const timer = setTimeout(() => {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        }, i * 55);
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [active, items, loading]);

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
      `}</style>

      <section
        id="portfolio"
        aria-label="Portfolio"
        ref={ref}
        style={{ background: '#F7F3E8', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p
              className="reveal"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#D9A521',
                marginBottom: 12,
              }}
            >
              Our Portfolio
            </p>
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 600,
                color: '#0B2B22',
                margin: '0 0 40px',
                letterSpacing: '-0.02em',
              }}
            >
              Stories We've Helped Tell
            </h2>

            {!preview && (
              <div
                role="tablist"
                aria-label="Filter portfolio by category"
                className="reveal reveal-delay-2"
                style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
              >
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    role="tab"
                    aria-selected={active === f}
                    onClick={() => setActive(f)}
                    style={{
                      padding: '9px 22px',
                      borderRadius: 40,
                      border: `1.5px solid ${active === f ? '#D9A521' : 'rgba(11,43,34,0.2)'}`,
                      background: active === f ? '#D9A521' : 'transparent',
                      color: active === f ? '#0B2B22' : 'rgba(11,43,34,0.65)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 18,
            }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : displayed.map((item, i) => (
                  <PortfolioCard key={item.id ?? item.title} item={item} index={i} />
                ))}
          </div>

          {!loading && filtered.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'rgba(11,43,34,0.5)',
                marginTop: 48,
              }}
            >
              No portfolio items in this category yet.
            </p>
          )}

          {/* View Full Portfolio CTA — shown only in preview mode */}
          {preview && !loading && (
            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <Link
                to="/portfolio"
                style={{
                  display: 'inline-block',
                  background: '#D9A521',
                  color: '#0B2B22',
                  padding: '16px 48px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 3,
                  transition: 'background 0.25s ease, transform 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0c84a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#D9A521';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Full Portfolio →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

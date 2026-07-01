import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../lib/api';

const CAT_MAP = {
  events:              'Events',
  confectioneries:     'Confectioneries',
  designs:             'Branding & Design',
  'branding & design': 'Branding & Design',
  other:               'Events',
};

function normalizeCategory(cat) {
  if (!cat) return 'Events';
  return CAT_MAP[cat.toLowerCase()] ?? cat;
}

const ACCENT = {
  'Events':            '#D9A521',
  'Confectioneries':   '#C97B5E',
  'Branding & Design': '#D9A521',
};

export default function PortfolioItem() {
  const { id } = useParams();
  const [item, setItem]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getPortfolioItem(id)
      .then(({ data }) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const displayCat = item ? normalizeCategory(item.category) : '';
  const accent     = ACCENT[displayCat] ?? '#D9A521';

  return (
    <Layout>
      {/* Page hero */}
      <section style={{
        position: 'relative',
        background: '#0B2B22',
        padding: '140px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        {/* Dot texture */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(247,243,232,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 500, height: 300,
          background: `radial-gradient(ellipse, ${accent}18 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Back link */}
        <div style={{ position: 'absolute', top: 100, left: 'max(24px, calc(50% - 580px))', zIndex: 1 }}>
          <Link
            to="/portfolio"
            style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'rgba(217,165,33,0.7)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(217,165,33,0.7)')}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M13 5H1M6 1L1 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {loading ? (
            <>
              <div aria-hidden="true" style={{
                width: 120, height: 14, borderRadius: 4, margin: '0 auto 20px',
                background: 'rgba(247,243,232,0.1)',
                animation: 'skeletonPulse 1.4s ease-in-out infinite',
              }} />
              <div aria-hidden="true" style={{
                width: 320, maxWidth: '80%', height: 40, borderRadius: 4, margin: '0 auto',
                background: 'rgba(247,243,232,0.08)',
                animation: 'skeletonPulse 1.4s ease-in-out infinite',
              }} />
            </>
          ) : notFound ? (
            <>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: 'rgba(247,243,232,0.5)', margin: '0 0 16px',
              }}>
                Project not found
              </p>
              <Link to="/portfolio" style={{
                color: '#D9A521', textDecoration: 'none',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              }}>
                ← View all projects
              </Link>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: accent, marginBottom: 20,
              }}>
                {displayCat}
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 68px)',
                fontWeight: 600, lineHeight: 1.1,
                color: '#F7F3E8', margin: '0 auto',
                letterSpacing: '-0.02em', maxWidth: 800,
              }}>
                {item.title}
              </h1>
            </>
          )}
        </div>
      </section>

      {/* Image */}
      {!loading && !notFound && (
        <section style={{ background: '#F7F3E8', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                style={{
                  width: '100%',
                  maxHeight: 680,
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: 4,
                  display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: 400, borderRadius: 4,
                background: 'rgba(11,43,34,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14,
                  color: 'rgba(11,43,34,0.35)', margin: 0,
                }}>
                  Image not available
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      {!loading && !notFound && (
        <section style={{ background: '#F7F3E8', padding: '0 24px 96px', textAlign: 'center' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ width: 48, height: 1, background: '#D9A521', margin: '0 auto 32px' }} />
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75,
              color: 'rgba(11,43,34,0.6)', margin: '0 0 28px',
            }}>
              Like what you see? Let's create something extraordinary together.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/book"
                style={{
                  display: 'inline-block', background: '#0B2B22', color: '#D9A521',
                  padding: '14px 36px', fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                  transition: 'background 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#0f3a2e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0B2B22';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Book a Consultation
              </Link>
              <Link
                to="/portfolio"
                style={{
                  display: 'inline-block', background: 'transparent', color: '#0B2B22',
                  padding: '13px 32px', fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                  border: '1.5px solid rgba(11,43,34,0.3)',
                  transition: 'border-color 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0B2B22';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(11,43,34,0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View More Work
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }`}</style>
    </Layout>
  );
}

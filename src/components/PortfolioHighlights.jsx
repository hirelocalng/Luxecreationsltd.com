import { useScrollReveal } from '../hooks/useScrollReveal';

const HIGHLIGHTS = [
  { label: 'Royal Garden Wedding', cat: 'Events', gradient: 'linear-gradient(135deg, #1a4033 0%, #2d6a4f 50%, #1a4033 100%)', accent: '#D9A521' },
  { label: 'Artisan Wedding Cake', cat: 'Confectioneries', gradient: 'linear-gradient(135deg, #3d1c0d 0%, #6b3521 50%, #3d1c0d 100%)', accent: '#C97B5E' },
  { label: 'Corporate Brand Identity', cat: 'Designs', gradient: 'linear-gradient(135deg, #0B2B22 0%, #1a5040 50%, #0B2B22 100%)', accent: '#D9A521' },
  { label: 'Luxury Birthday Gala', cat: 'Events', gradient: 'linear-gradient(135deg, #1c2d1a 0%, #2e5c28 50%, #1c2d1a 100%)', accent: '#D9A521' },
  { label: 'Tiered Celebration Cake', cat: 'Confectioneries', gradient: 'linear-gradient(135deg, #2d1a1a 0%, #5c3030 50%, #2d1a1a 100%)', accent: '#C97B5E' },
  { label: 'Product Launch Event', cat: 'Events', gradient: 'linear-gradient(135deg, #0e2a2a 0%, #1a5050 50%, #0e2a2a 100%)', accent: '#D9A521' },
];

export default function PortfolioHighlights() {
  const ref = useScrollReveal();

  return (
    <section
      aria-label="Portfolio highlights"
      ref={ref}
      style={{ background: '#F7F3E8', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#D9A521',
            marginBottom: 12,
          }}>
            Our Work
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#0B2B22',
            margin: '0 0 20px',
            letterSpacing: '-0.02em',
          }}>
            A Glimpse of Our Portfolio
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'rgba(11,43,34,0.6)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Every project we take on becomes a chapter in someone's story.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {HIGHLIGHTS.map(({ label, cat, gradient, accent }, i) => (
            <div
              key={label}
              className={`portfolio-card reveal reveal-delay-${(i % 3) + 1}`}
              style={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '4/3',
                background: gradient,
                cursor: 'pointer',
              }}
            >
              {/* Decorative pattern */}
              <div aria-hidden="true" style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />

              {/* Content overlay — always visible */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 24,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: 6,
                }}>
                  {cat}
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#F7F3E8',
                }}>
                  {label}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                className="portfolio-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11,43,34,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#D9A521',
                  border: '1px solid #D9A521',
                  padding: '10px 20px',
                  borderRadius: 2,
                }}>
                  View Project
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: 'center', marginTop: 48 }}>
          <a
            href="#portfolio"
            style={{
              display: 'inline-block',
              background: '#0B2B22',
              color: '#D9A521',
              padding: '14px 36px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              fontFamily: 'var(--font-body)',
              border: '1px solid #0B2B22',
              transition: 'background 0.25s ease, border-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#0B2B22';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#0B2B22';
            }}
          >
            View Full Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}

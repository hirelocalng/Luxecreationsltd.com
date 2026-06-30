import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal();

  return (
    <section
      id="about"
      aria-label="About us"
      ref={ref}
      style={{ background: '#F7F3E8', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 64,
          alignItems: 'center',
        }}>
          {/* Left: story */}
          <div>
            <p className="reveal" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#D9A521',
              marginBottom: 16,
            }}>
              About Us
            </p>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 600,
              color: '#0B2B22',
              margin: '0 0 24px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}>
              Where Artistry Meets Precision
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(11,43,34,0.72)',
              margin: '0 0 20px',
            }}>
              Luxe Creations Ltd was born from a singular belief: that every
              celebration, every bite, and every brand deserves to be truly
              exceptional. Based in Onitsha, Anambra State, we serve clients
              across Nigeria who refuse to settle for ordinary.
            </p>
            <p className="reveal reveal-delay-3" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(11,43,34,0.72)',
              margin: '0 0 36px',
            }}>
              Through our three creative divisions — Luxe Events, Luxe
              Confectioneries, and Luxe Designs — we bring together expertise
              in event planning, pastry artistry, and visual branding to offer
              clients a seamless, integrated creative experience unlike any
              other.
            </p>
            <a
              className="reveal reveal-delay-4"
              href="#contact"
              style={{
                display: 'inline-block',
                background: '#0B2B22',
                color: '#D9A521',
                padding: '14px 32px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 3,
                fontFamily: 'var(--font-body)',
                transition: 'background 0.25s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0f3a2e';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#0B2B22';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Work With Us
            </a>
          </div>

          {/* Right: mission/vision cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Mission */}
            <div className="reveal reveal-delay-2" style={{
              background: '#0B2B22',
              borderRadius: 4,
              padding: '36px 32px',
              borderLeft: '3px solid #D9A521',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D9A521',
                margin: '0 0 14px',
              }}>
                Our Mission
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(247,243,232,0.78)',
                margin: 0,
              }}>
                To create immersive, emotionally resonant experiences that
                celebrate life's most meaningful moments — with artistry,
                passion, and an unwavering commitment to excellence.
              </p>
            </div>

            {/* Vision */}
            <div className="reveal reveal-delay-3" style={{
              background: '#0B2B22',
              borderRadius: 4,
              padding: '36px 32px',
              borderLeft: '3px solid rgba(217,165,33,0.4)',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D9A521',
                margin: '0 0 14px',
              }}>
                Our Vision
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(247,243,232,0.78)',
                margin: 0,
              }}>
                To be Nigeria's most admired creative lifestyle brand —
                synonymous with luxury, originality, and the kind of
                storytelling that turns moments into memories and brands
                into legacies.
              </p>
            </div>

            {/* Stats row */}
            <div className="reveal reveal-delay-4" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {[
                { value: '200+', label: 'Events Executed' },
                { value: '500+', label: 'Cakes Delivered' },
                { value: '80+', label: 'Brands Built' },
              ].map(({ value, label }) => (
                <div key={label} style={{
                  background: '#0B2B22',
                  borderRadius: 4,
                  padding: '20px 16px',
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#D9A521',
                    margin: '0 0 4px',
                    lineHeight: 1,
                  }}>
                    {value}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    color: 'rgba(247,243,232,0.55)',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SERVICES = [
  'Brand Identity & Logo Design',
  'Color Palette & Typography Systems',
  'Stationery & Print Design',
  'Event Branding & Signage',
  'Social Media Graphics & Templates',
  'Marketing Collateral & Flyers',
  'Packaging Design',
  'Digital Content & Banner Design',
  'Brand Guidelines & Style Guides',
  'Social Media Design Retainers',
  'Pitch Decks & Presentations',
  'Website & App UI Concepts',
];

const PACKAGES = [
  {
    name: 'Brand Starter',
    desc: 'Perfect for new businesses — logo, colour palette, typography, and a one-page brand guide.',
    ideal: 'Startups & new ventures',
  },
  {
    name: 'Brand Identity',
    desc: 'Comprehensive brand system: logo suite, stationery, social media kit, and full brand guide.',
    ideal: 'Growing businesses',
  },
  {
    name: 'Brand & Marketing',
    desc: 'Everything in Brand Identity plus ongoing marketing collateral and social media graphics.',
    ideal: 'Established businesses',
  },
];

function PackagesSection() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} style={{ background: '#F7F3E8', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D9A521', marginBottom: 12,
          }}>
            Our Packages
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 600, color: '#0B2B22', margin: 0,
          }}>
            Find the Right Fit for Your Brand
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 28,
        }}>
          {PACKAGES.map(({ name, desc, ideal }, i) => (
            <div key={name} className={`reveal reveal-delay-${i + 1}`} style={{
              background: '#0B2B22',
              borderRadius: 4,
              padding: '44px 36px',
              border: '1px solid rgba(217,165,33,0.15)',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#D9A521', margin: '0 0 12px',
              }}>
                Ideal for: {ideal}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
                color: '#F7F3E8', margin: '0 0 16px',
              }}>
                {name}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75,
                color: 'rgba(247,243,232,0.65)', margin: '0 0 32px',
              }}>
                {desc}
              </p>
              <Link to="/book" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                color: '#D9A521', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                transition: 'gap 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = '14px')}
              onMouseLeave={(e) => (e.currentTarget.style.gap = '8px')}
              >
                Get a Quote
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <path d="M1 5H15M10 1L15 5L10 9" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPlaceholder() {
  const ref = useScrollReveal();
  const labels = ['Logo & Identity', 'Event Branding', 'Social Media Kit', 'Packaging', 'Marketing Collateral', 'Brand Guide'];
  return (
    <section ref={ref} style={{ background: '#0B2B22', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D9A521', marginBottom: 12,
          }}>
            Our Work
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 600, color: '#F7F3E8', margin: 0,
          }}>
            Brands We've Built
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {labels.map((label, i) => (
            <div key={label} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
              aspectRatio: '4/3',
              background: 'rgba(247,243,232,0.04)',
              border: '1px solid rgba(247,243,232,0.08)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'flex-end',
              padding: 20,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(217,165,33,0.05) 0%, transparent 60%)',
              }} />
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(217,165,33,0.55)', margin: 0, position: 'relative', zIndex: 1,
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <p style={{
          textAlign: 'center', marginTop: 32,
          fontFamily: 'var(--font-body)', fontSize: 13,
          color: 'rgba(247,243,232,0.35)',
        }}>
          Portfolio images coming soon — follow us on Instagram to see our latest design work.
        </p>
      </div>
    </section>
  );
}

export default function DesignsPage() {
  const contentRef = useScrollReveal();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      {/* Page Hero */}
      <section style={{
        position: 'relative',
        background: '#0B2B22',
        padding: '140px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(247,243,232,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(217,165,33,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 100, left: 'max(24px, calc(50% - 580px))', zIndex: 1 }}>
          <Link to="/" style={{
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
            Back to Home
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#D9A521', marginBottom: 20,
          }}>
            Division III
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#D9A521', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Luxe Designs
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 600, margin: '0 auto',
          }}>
            Visual identities that are bold, beautiful, and unmistakably you. We build brands
            that command attention, inspire loyalty, and convert.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} style={{ background: '#0B2B22', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64, alignItems: 'start',
          }}>
            <div>
              <p className="reveal" style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: '#D9A521', marginBottom: 16,
              }}>
                Our Philosophy
              </p>
              <h2 className="reveal reveal-delay-1" style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 600, color: '#F7F3E8', margin: '0 0 24px',
                lineHeight: 1.15, letterSpacing: '-0.01em',
              }}>
                Brands That Command Attention
              </h2>
              <p className="reveal reveal-delay-2" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 20px',
              }}>
                Your brand is your first impression — and we make it count. Luxe Designs creates
                visual identities that are bold, beautiful, and unmistakably you. From concept to
                final asset, we build brands that command attention and inspire loyalty.
              </p>
              <p className="reveal reveal-delay-3" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 20px',
              }}>
                Whether you're launching a new business, rebranding an existing one, or simply
                need stunning visual content for your next campaign, Luxe Designs delivers
                creativity that converts.
              </p>
              <p className="reveal reveal-delay-4" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 40px',
              }}>
                Every project begins with understanding your vision, your audience, and your goals.
                We then craft a bespoke visual system that grows with your business.
              </p>
              <Link
                className="reveal reveal-delay-5"
                to="/book"
                style={{
                  display: 'inline-block',
                  background: '#D9A521', color: '#0B2B22',
                  padding: '16px 40px', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: 3,
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.25s ease, transform 0.2s ease',
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
                Start Your Brand
              </Link>
            </div>

            <div className="reveal reveal-delay-2">
              <h3 style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(247,243,232,0.4)', margin: '0 0 24px',
              }}>
                Design Services
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {SERVICES.map((s) => (
                  <li key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 0', borderBottom: '1px solid rgba(247,243,232,0.07)',
                    fontFamily: 'var(--font-body)', fontSize: 15,
                    color: 'rgba(247,243,232,0.78)',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#D9A521', flexShrink: 0,
                    }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PackagesSection />
      <PortfolioPlaceholder />

      {/* CTA */}
      <section style={{
        background: '#D9A521', padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600, color: '#0B2B22', margin: '0 0 20px', lineHeight: 1.2,
          }}>
            Ready to Build Your Brand?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7,
            color: 'rgba(11,43,34,0.72)', margin: '0 0 36px',
          }}>
            Let's start with a discovery call to understand your vision and goals.
            From there, we'll craft a brand that truly reflects who you are.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book" style={{
              display: 'inline-block', background: '#0B2B22', color: '#D9A521',
              padding: '16px 40px', fontSize: 14, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: 3, fontFamily: 'var(--font-body)',
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
              Start Your Project
            </Link>
            <a href="https://wa.me/2349063930552" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: 'transparent', color: '#0B2B22',
                padding: '15px 36px', fontSize: 14, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 3,
                border: '1.5px solid #0B2B22', fontFamily: 'var(--font-body)',
                transition: 'background 0.25s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(11,43,34,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

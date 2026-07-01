import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { API_URL } from '../utils/api';

const SERVICES = [
  'Luxury Wedding Planning & Full Design',
  'Corporate Events & Product Launches',
  'Milestone Birthday Celebrations',
  'Baby Showers & Bridal Showers',
  'Traditional & Cultural Ceremonies',
  'Intimate Private Dinners & Soirées',
  'Venue Sourcing & Décor Installation',
  'Full Vendor Coordination & Management',
  'On-the-Day Event Management',
  'Lighting, Florals & Styling',
  'Catering & Entertainment Sourcing',
  'Post-Event Wrap & Review',
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'We begin with a deep conversation about your vision, expectations, guest count, and budget — understanding what your event means to you.',
  },
  {
    step: '02',
    title: 'Concept & Design',
    desc: 'We present a tailored event concept — theme, colour palette, décor direction, and a curated vendor shortlist that matches your style perfectly.',
  },
  {
    step: '03',
    title: 'Planning & Booking',
    desc: 'We handle all vendor negotiations, contracts, and logistics, keeping you updated every step of the way while you stay stress-free.',
  },
  {
    step: '04',
    title: 'Flawless Execution',
    desc: 'Our team is on-site from setup to final send-off — orchestrating every moment so your event unfolds exactly as you dreamed.',
  },
];

function ProcessSection() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} style={{ background: '#F7F3E8', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D9A521', marginBottom: 12,
          }}>
            Our Process
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 600, color: '#0B2B22', margin: 0, letterSpacing: '-0.01em',
          }}>
            How We Bring Your Event to Life
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 36,
        }}>
          {PROCESS.map(({ step, title, desc }, i) => (
            <div key={step} className={`reveal reveal-delay-${i + 1}`} style={{
              borderTop: '2px solid #D9A521',
              paddingTop: 28,
            }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 600,
                color: 'rgba(11,43,34,0.1)', margin: '0 0 12px', lineHeight: 1,
              }}>{step}</p>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
                color: '#0B2B22', margin: '0 0 12px',
              }}>{title}</h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.75,
                color: 'rgba(11,43,34,0.68)', margin: 0,
              }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DivisionGallery() {
  const ref = useScrollReveal();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/division-media?division=events&published=true`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_URL}/api/portfolio?category=events`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([mediaRes, portfolioRes]) => {
      const mediaItems = (mediaRes.data || []).map(m => ({
        id: `m-${m.id}`, title: m.title || '', type: m.media_type,
        src: m.media_url, poster: m.thumbnail_url,
      }));
      const portfolioItems = (portfolioRes.data || []).map(p => ({
        id: `p-${p.id}`, title: p.title || '', type: 'image',
        src: p.image_url, poster: null,
      }));
      setItems([...mediaItems, ...portfolioItems]);
      setLoading(false);
    });
  }, []);

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
            Events We've Created
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} aria-hidden="true" style={{
                aspectRatio: '4/3', minHeight: 240,
                background: 'rgba(247,243,232,0.06)',
                borderRadius: 4,
                animation: 'skeletonPulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p style={{
            textAlign: 'center',
            fontFamily: 'var(--font-body)', fontSize: 15,
            color: 'rgba(247,243,232,0.4)', margin: 0,
          }}>
            Portfolio images coming soon — follow us on Instagram for our latest events.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {items.map((item, i) => (
              <div key={item.id} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
                position: 'relative',
                aspectRatio: '4/3', minHeight: 240,
                borderRadius: 4, overflow: 'hidden',
                background: '#0a2218',
              }}>
                {item.type === 'video' ? (
                  <video
                    muted
                    controls
                    playsInline
                    poster={item.poster}
                    src={item.src}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block',
                    }}
                  />
                ) : item.src && (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                )}
                {item.type !== 'video' && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: 20,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
                      color: '#F7F3E8', margin: 0, lineHeight: 1.3,
                    }}>
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }`}</style>
    </section>
  );
}

export default function EventsPage() {
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
            Division I
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#D9A521', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Luxe Events
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 600, margin: '0 auto',
          }}>
            Bespoke event planning and design for those who believe every detail matters.
            From intimate gatherings to grand celebrations — we make it extraordinary.
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
                Who We Are
              </p>
              <h2 className="reveal reveal-delay-1" style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 600, color: '#F7F3E8', margin: '0 0 24px',
                lineHeight: 1.15, letterSpacing: '-0.01em',
              }}>
                Events That Become Memories
              </h2>
              <p className="reveal reveal-delay-2" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 20px',
              }}>
                Every event we plan is a bespoke experience — meticulously conceptualised,
                flawlessly executed, and deeply personal. We don't just plan events; we craft
                moments that become memories you'll carry for a lifetime.
              </p>
              <p className="reveal reveal-delay-3" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 20px',
              }}>
                From intimate gatherings of twenty to grand celebrations of two thousand, our
                events carry the unmistakable Luxe signature: elevated, refined, and unforgettable.
                We bring an obsessive attention to detail to every brief — ensuring nothing is left
                to chance.
              </p>
              <p className="reveal reveal-delay-4" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(247,243,232,0.68)', margin: '0 0 40px',
              }}>
                Our team of seasoned event professionals draws on a network of Onitsha's finest
                vendors, venues, and creative talents to deliver an event that exceeds every expectation.
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
                Plan Your Event
              </Link>
            </div>

            <div className="reveal reveal-delay-2">
              <h3 style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(247,243,232,0.5)', margin: '0 0 24px',
              }}>
                What We Offer
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

      <ProcessSection />
      <DivisionGallery />

      {/* CTA */}
      <section style={{
        background: '#D9A521', padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600, color: '#0B2B22', margin: '0 0 20px', lineHeight: 1.2,
          }}>
            Ready to Plan Your Event?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7,
            color: 'rgba(11,43,34,0.72)', margin: '0 0 36px',
          }}>
            Let's start with a consultation — no obligation, just a conversation about
            how we can make your event truly unforgettable.
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
              Book a Consultation
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

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { API_URL } from '../utils/api';

const SERVICES = [
  'Custom Celebration & Wedding Cakes',
  'Tiered & Multi-Tier Statement Cakes',
  'Cupcakes & Mini Cakes',
  'Cake Pops & Dessert Bites',
  'Bespoke Dessert Tables',
  'Artisan Pastries & Baked Goods',
  'Confectionery Gift Packages',
  'Sculpted & Themed Cakes',
  'Dietary-Friendly Options (gluten-free, reduced sugar)',
  'Tasting Sessions by Appointment',
  'Nationwide Delivery Available',
  'Corporate Gifting & Branded Confections',
];

function DivisionGallery() {
  const ref = useScrollReveal();
  const { items, loading } = useFetch(() => api.getPortfolio('confectioneries'), []);

  useEffect(() => {
    fetch(`${API_URL}/api/portfolio`)
      .then(r => r.json())
      .then(data => { console.log('[ConfectioneriesPage] ALL PORTFOLIO ITEMS:', JSON.stringify(data)); });
  }, []);

  return (
    <section ref={ref} style={{ background: '#0B2B22', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C97B5E', marginBottom: 12,
          }}>
            Our Creations
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 600, color: '#F7F3E8', margin: 0,
          }}>
            Confections We've Crafted
          </h2>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} aria-hidden="true" style={{
                aspectRatio: '3/4', minHeight: 280,
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
            Portfolio images coming soon — follow us on Instagram for our latest creations.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {items.map((item, i) => (
              <div key={item.id} className={`reveal reveal-delay-${(i % 3) + 1}`} style={{
                position: 'relative',
                aspectRatio: '3/4', minHeight: 280,
                borderRadius: 4, overflow: 'hidden',
                background: '#0a2218',
              }}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none'; console.warn('[ConfectioneriesPage] img load failed:', item.image_url); }}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                )}
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
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }`}</style>
    </section>
  );
}

export default function ConfectioneriesPage() {
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
          background: 'radial-gradient(ellipse, rgba(201,123,94,0.12) 0%, transparent 70%)',
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
            color: '#C97B5E', marginBottom: 20,
          }}>
            Division II
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#D9A521', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Luxe Confectioneries
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 600, margin: '0 auto',
          }}>
            Handcrafted confections that are as stunning to behold as they are unforgettable to taste.
            Premium ingredients, extraordinary artistry, and a passion for detail.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section ref={contentRef} style={{ background: '#F7F3E8', padding: '96px 24px' }}>
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
                color: '#C97B5E', marginBottom: 16,
              }}>
                Edible Art
              </p>
              <h2 className="reveal reveal-delay-1" style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 600, color: '#0B2B22', margin: '0 0 24px',
                lineHeight: 1.15, letterSpacing: '-0.01em',
              }}>
                Where Every Bite is a Masterpiece
              </h2>
              <p className="reveal reveal-delay-2" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(11,43,34,0.7)', margin: '0 0 20px',
              }}>
                Our confections are more than cake — they are edible art. Each piece is crafted
                by hand with premium ingredients, extraordinary attention to detail, and a passion
                for creating something that delights all the senses.
              </p>
              <p className="reveal reveal-delay-3" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(11,43,34,0.7)', margin: '0 0 20px',
              }}>
                Whether it's your wedding centrepiece, a birthday showstopper, or a curated dessert
                table for fifty guests, Luxe Confectioneries delivers beauty and flavour in equal measure.
                Every creation is a conversation starter, a centrepiece, a memory.
              </p>
              <p className="reveal reveal-delay-4" style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                lineHeight: 1.8, color: 'rgba(11,43,34,0.7)', margin: '0 0 40px',
              }}>
                We offer tasting sessions by appointment so you can experience the quality firsthand
                before placing your order. Nationwide delivery is available for select orders.
              </p>
              <div className="reveal reveal-delay-5" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/book" style={{
                  display: 'inline-block', background: '#C97B5E', color: '#F7F3E8',
                  padding: '15px 32px', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: 3, fontFamily: 'var(--font-body)',
                  transition: 'background 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b36a4e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#C97B5E';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  Order a Cake
                </Link>
                <Link to="/book" style={{
                  display: 'inline-block', background: 'transparent', color: '#0B2B22',
                  padding: '14px 30px', fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none', borderRadius: 3,
                  border: '1.5px solid #0B2B22', fontFamily: 'var(--font-body)',
                  transition: 'background 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(11,43,34,0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                >
                  Book a Tasting
                </Link>
              </div>
            </div>

            <div className="reveal">
              <h3 style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(11,43,34,0.45)', margin: '0 0 24px',
              }}>
                Our Confectioneries
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {SERVICES.map((s) => (
                  <li key={s} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 0', borderBottom: '1px solid rgba(11,43,34,0.08)',
                    fontFamily: 'var(--font-body)', fontSize: 15,
                    color: 'rgba(11,43,34,0.78)',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#C97B5E', flexShrink: 0,
                    }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <DivisionGallery />

      {/* CTA */}
      <section style={{
        background: '#C97B5E', padding: '80px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600, color: '#F7F3E8', margin: '0 0 20px', lineHeight: 1.2,
          }}>
            Ready to Order Your Confection?
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7,
            color: 'rgba(247,243,232,0.85)', margin: '0 0 36px',
          }}>
            Place an order or book a tasting session — we'll guide you through every detail
            to create something truly spectacular.
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
              Place an Order
            </Link>
            <a href="https://wa.me/2349063930552" target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block', background: 'transparent', color: '#F7F3E8',
                padding: '15px 36px', fontSize: 14, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 3,
                border: '1.5px solid rgba(247,243,232,0.6)', fontFamily: 'var(--font-body)',
                transition: 'border-color 0.25s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#F7F3E8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(247,243,232,0.6)';
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

import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

const FALLBACK_SERVICES = [
  'Custom Celebration & Wedding Cakes',
  'Tiered & Multi-Tier Cakes',
  'Cupcakes & Mini Cakes',
  'Cake Pops & Dessert Bites',
  'Bespoke Dessert Tables',
  'Artisan Pastries & Baked Goods',
  'Confectionery Gift Packages',
  'Dietary-Friendly Options (gluten-free, reduced sugar)',
  'Tasting Sessions by Appointment',
  'Nationwide Delivery Available',
];

export default function LuxeConfectioneries() {
  const ref = useScrollReveal();
  const { items, loading } = useFetch(() => api.getServices('confectioneries'), FALLBACK_SERVICES.map(t => ({ title: t })));
  const services = items.map(s => (typeof s === 'string' ? s : s.title));

  return (
    <section
      id="confectioneries"
      aria-label="Luxe Confectioneries"
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
          <div>
            <p className="reveal" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C97B5E',
              marginBottom: 16,
            }}>
              Division II
            </p>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4vw, 50px)',
              fontWeight: 600,
              color: '#0B2B22',
              margin: '0 0 24px',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}>
              Luxe Confectioneries
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(11,43,34,0.7)',
              margin: '0 0 20px',
            }}>
              Our confections are more than cake — they are edible art.
              Each piece is crafted by hand with premium ingredients,
              extraordinary attention to detail, and a passion for
              creating something that delights all the senses.
            </p>
            <p className="reveal reveal-delay-3" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(11,43,34,0.7)',
              margin: '0 0 40px',
            }}>
              Whether it's your wedding centrepiece, a birthday showstopper,
              or a curated dessert table for fifty guests, Luxe Confectioneries
              delivers beauty and flavour in equal measure.
            </p>
            <div className="reveal">
              <h3 style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(11,43,34,0.45)',
                margin: '0 0 24px',
              }}>
                Our Confectioneries
              </h3>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{
                      height: 48,
                      borderBottom: '1px solid rgba(11,43,34,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(201,123,94,0.25)', flexShrink: 0 }} />
                      <div style={{ height: 12, width: `${55 + (i % 3) * 15}%`, background: 'rgba(11,43,34,0.07)', borderRadius: 3 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {services.map((s) => (
                    <li key={s} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 0',
                      borderBottom: '1px solid rgba(11,43,34,0.08)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 15,
                      color: 'rgba(11,43,34,0.78)',
                    }}>
                      <span aria-hidden="true" style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#C97B5E',
                        flexShrink: 0,
                      }} />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="reveal reveal-delay-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 40 }}>
              <Link
                to="/book"
                style={{
                  display: 'inline-block',
                  background: '#C97B5E',
                  color: '#F7F3E8',
                  padding: '15px 32px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 3,
                  fontFamily: 'var(--font-body)',
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
              <Link
                to="/confectioneries"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: '#0B2B22',
                  padding: '14px 28px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 3,
                  border: '1.5px solid rgba(11,43,34,0.4)',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.25s ease, gap 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0B2B22';
                  e.currentTarget.style.gap = '14px';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(11,43,34,0.4)';
                  e.currentTarget.style.gap = '8px';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore Confectioneries →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

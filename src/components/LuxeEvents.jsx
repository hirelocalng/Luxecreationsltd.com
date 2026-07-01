import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

const FALLBACK_SERVICES = [
  'Luxury Wedding Planning & Design',
  'Corporate Events & Product Launches',
  'Milestone Birthday Celebrations',
  'Baby Showers & Bridal Showers',
  'Traditional & Cultural Ceremonies',
  'Intimate Private Dinners',
  'Venue Sourcing & Décor',
  'Full Vendor Coordination',
  'On-the-Day Event Management',
  'Post-Event Wrap & Review',
];

export default function LuxeEvents() {
  const ref = useScrollReveal();
  const { items, loading } = useFetch(() => api.getServices('events'), FALLBACK_SERVICES.map(t => ({ title: t })));
  const services = items.map(s => (typeof s === 'string' ? s : s.title));

  return (
    <section
      id="events"
      aria-label="Luxe Events"
      ref={ref}
      style={{ background: '#0B2B22', padding: '96px 24px' }}
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
              color: '#D9A521',
              marginBottom: 16,
            }}>
              Division I
            </p>
            <h2 className="reveal reveal-delay-1" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4vw, 50px)',
              fontWeight: 600,
              color: '#F7F3E8',
              margin: '0 0 24px',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}>
              Luxe Events
            </h2>
            <p className="reveal reveal-delay-2" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(247,243,232,0.68)',
              margin: '0 0 20px',
            }}>
              Every event we plan is a bespoke experience — meticulously
              conceptualised, flawlessly executed, and deeply personal. We
              don't just plan events; we craft moments that become memories.
            </p>
            <p className="reveal reveal-delay-3" style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(247,243,232,0.68)',
              margin: '0 0 40px',
            }}>
              From intimate gatherings of twenty to grand celebrations of
              two thousand, our events carry the unmistakable Luxe signature:
              elevated, refined, and unforgettable.
            </p>
            <div className="reveal reveal-delay-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link
                to="/book"
                style={{
                  display: 'inline-block',
                  background: '#D9A521',
                  color: '#0B2B22',
                  padding: '15px 36px',
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
                  e.currentTarget.style.background = '#f0c84a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#D9A521';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Book a Consultation
              </Link>
              <Link
                to="/events"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: '#D9A521',
                  padding: '14px 28px',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  borderRadius: 3,
                  border: '1.5px solid rgba(217,165,33,0.5)',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.25s ease, gap 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D9A521';
                  e.currentTarget.style.gap = '14px';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(217,165,33,0.5)';
                  e.currentTarget.style.gap = '8px';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore Events →
              </Link>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <h3 style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(247,243,232,0.5)',
              margin: '0 0 24px',
            }}>
              What We Offer
            </h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    height: 48,
                    borderBottom: '1px solid rgba(247,243,232,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(217,165,33,0.25)', flexShrink: 0 }} />
                    <div style={{ height: 12, width: `${55 + (i % 3) * 15}%`, background: 'rgba(247,243,232,0.08)', borderRadius: 3 }} />
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
                    borderBottom: '1px solid rgba(247,243,232,0.07)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    color: 'rgba(247,243,232,0.78)',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#D9A521',
                      flexShrink: 0,
                    }} />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

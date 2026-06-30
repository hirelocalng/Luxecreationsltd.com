import { useScrollReveal } from '../hooks/useScrollReveal';

const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width={40} height={40}>
        <circle cx="20" cy="20" r="19" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M13 20l5 5 9-9" stroke="#D9A521" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Expertise & Vision',
    body: 'Over a decade of creative excellence across events, pastry arts, and visual identity — delivered with a discerning eye for detail.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width={40} height={40}>
        <circle cx="20" cy="20" r="19" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M20 10 L23 17 L31 17 L25 22 L27 30 L20 25 L13 30 L15 22 L9 17 L17 17 Z" stroke="#D9A521" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Premium Quality',
    body: 'From hand-crafted confections to bespoke brand identities, every element we produce meets the standard of true luxury.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width={40} height={40}>
        <circle cx="20" cy="20" r="19" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M14 20 C14 16.7 16.7 14 20 14 C23.3 14 26 16.7 26 20 C26 23.3 23.3 26 20 26" stroke="#D9A521" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.5" fill="#D9A521" />
      </svg>
    ),
    title: 'Client-Centred',
    body: 'Your vision is our blueprint. We listen deeply, collaborate closely, and craft solutions that are unmistakably yours.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" width={40} height={40}>
        <circle cx="20" cy="20" r="19" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M12 28 L20 12 L28 28" stroke="#D9A521" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 23 L25 23" stroke="#D9A521" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: 'Seamless Execution',
    body: 'We handle every detail so you don\'t have to — from first concept to final flourish, delivered on time and beyond expectation.',
  },
];

export default function WhyChooseUs() {
  const ref = useScrollReveal();

  return (
    <section
      aria-label="Why choose us"
      ref={ref}
      style={{ background: '#F7F3E8', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#D9A521',
            marginBottom: 12,
          }}>
            Our Promise
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#0B2B22',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Why Choose Luxe Creations
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
        }}>
          {PILLARS.map(({ icon, title, body }, i) => (
            <div
              key={title}
              className={`reveal reveal-delay-${i + 1}`}
              style={{ textAlign: 'center' }}
            >
              <div style={{ marginBottom: 20 }}>{icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 600,
                color: '#0B2B22',
                margin: '0 0 12px',
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                lineHeight: 1.75,
                color: 'rgba(11,43,34,0.72)',
                margin: 0,
              }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

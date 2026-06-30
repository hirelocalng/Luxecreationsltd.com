import { useScrollReveal } from '../hooks/useScrollReveal';

const STEPS = [
  {
    number: '01',
    title: 'Consultation',
    description:
      'We begin with a deep-dive conversation to understand your vision, preferences, and goals. Every detail matters.',
  },
  {
    number: '02',
    title: 'Design & Proposal',
    description:
      'Our creative team crafts a tailored proposal — mood boards, concepts, and timelines — uniquely suited to you.',
  },
  {
    number: '03',
    title: 'Execution',
    description:
      'With precision and passion, we bring every element to life. You relax; we handle every detail flawlessly.',
  },
  {
    number: '04',
    title: 'Celebration',
    description:
      'The moment arrives. You experience the Luxe difference — an event or delivery that exceeds every expectation.',
  },
];

export default function Process() {
  const ref = useScrollReveal();

  return (
    <section
      aria-label="Our process"
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
            How It Works
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#0B2B22',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            The Luxe Experience
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 32,
          position: 'relative',
        }}>
          {STEPS.map(({ number, title, description }, i) => (
            <div
              key={number}
              className={`reveal reveal-delay-${i + 1}`}
              style={{ position: 'relative' }}
            >
              {/* Step number */}
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '1.5px solid #D9A521',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                background: 'transparent',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#D9A521',
                }}>
                  {number}
                </span>
              </div>

              {/* Connector line (desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 29,
                    left: 60,
                    right: -32,
                    height: 1,
                    background: 'rgba(217,165,33,0.2)',
                  }}
                />
              )}

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
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
                color: 'rgba(11,43,34,0.68)',
                margin: 0,
              }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

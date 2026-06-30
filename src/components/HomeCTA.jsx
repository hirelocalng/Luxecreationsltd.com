import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomeCTA() {
  const ref = useScrollReveal();

  return (
    <section
      aria-label="Call to action"
      ref={ref}
      style={{
        background: '#0B2B22',
        padding: '96px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 600,
        height: 300,
        background: 'radial-gradient(ellipse, rgba(217,165,33,0.08) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
        <p className="reveal" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#D9A521',
          marginBottom: 16,
        }}>
          Ready to Begin?
        </p>
        <h2 className="reveal reveal-delay-1" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 5vw, 54px)',
          fontWeight: 600,
          color: '#F7F3E8',
          margin: '0 0 24px',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>
          Let's Create Something Extraordinary Together
        </h2>
        <p className="reveal reveal-delay-2" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 16,
          lineHeight: 1.7,
          color: 'rgba(247,243,232,0.65)',
          margin: '0 0 44px',
        }}>
          Whether you're planning a once-in-a-lifetime celebration, ordering a bespoke cake,
          or building a brand that turns heads — we're here to make it extraordinary.
        </p>

        <div className="reveal reveal-delay-3" style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            to="/book"
            style={{
              display: 'inline-block',
              background: '#D9A521',
              color: '#0B2B22',
              padding: '16px 40px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              fontFamily: 'var(--font-body)',
              transition: 'background 0.25s ease, transform 0.25s ease',
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
          <a
            href="https://wa.me/2349063930552"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              color: '#D9A521',
              padding: '15px 36px',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 3,
              border: '1.5px solid #D9A521',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(217,165,33,0.1)';
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
  );
}

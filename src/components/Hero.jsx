import { Link } from 'react-router-dom';

const BG_IMAGE = 'url("https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80")';
const OVERLAY   = 'linear-gradient(rgba(11,43,34,0.75), rgba(11,43,34,0.75))';

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: `${OVERLAY}, ${BG_IMAGE}`,
        backgroundSize: 'cover',
        WebkitBackgroundSize: 'cover',
        MozBackgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'scroll',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle dot texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(247,243,232,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient glow — slow drift */}
      <div
        aria-hidden="true"
        className="light-drift"
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          width: 680,
          height: 680,
          background:
            'radial-gradient(circle, rgba(217,165,33,0.14) 0%, rgba(217,165,33,0.04) 45%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      {/* Second ambient layer — pulsing */}
      <div
        aria-hidden="true"
        className="ambient-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 420,
          height: 420,
          background:
            'radial-gradient(circle, rgba(217,165,33,0.10) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '120px 24px 80px',
          maxWidth: 820,
          width: '100%',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <img
            src="/assets/logo.png"
            alt="Luxe Creations Ltd"
            className="hero-logo hero-logo-responsive"
            style={{
              width: 'auto',
              objectFit: 'contain',
              display: 'inline-block',
            }}
          />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#D9A521',
            marginBottom: 20,
            opacity: 0,
            animation: 'heroFadeIn 0.9s 0.4s ease forwards',
          }}
        >
          Creative Lifestyle Brand
        </p>

        {/* Main headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5.5vw, 68px)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#F7F3E8',
            margin: '0 0 8px',
            letterSpacing: '-0.01em',
            opacity: 0,
            animation: 'heroFadeIn 1s 0.55s ease forwards',
          }}
        >
          Creating Memorable Experiences,
        </h1>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5.5vw, 68px)',
            fontWeight: 600,
            lineHeight: 1.15,
            color: '#D9A521',
            margin: '0 0 28px',
            letterSpacing: '-0.01em',
            opacity: 0,
            animation: 'heroFadeIn 1s 0.65s ease forwards',
          }}
        >
          Beautiful Celebrations &amp; Impactful Brands
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7,
            color: 'rgba(247,243,232,0.68)',
            maxWidth: 560,
            margin: '0 auto 44px',
            opacity: 0,
            animation: 'heroFadeIn 1s 0.8s ease forwards',
          }}
        >
          Luxe Creations Ltd brings together three distinct creative divisions —
          events, confectioneries, and design — to deliver extraordinary
          experiences that leave a lasting impression.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
            animation: 'heroFadeIn 1s 1s ease forwards',
          }}
        >
          <Link
            to="/book"
            style={{
              display: 'inline-block',
              background: '#D9A521',
              color: '#0B2B22',
              padding: '16px 36px',
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
            href="#portfolio"
            style={{
              display: 'inline-block',
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
              transition: 'background 0.25s ease, color 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(217,165,33,0.12)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            View Our Portfolio
          </a>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: 0.5,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#D9A521',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 1,
              height: 32,
              background: 'linear-gradient(to bottom, #D9A521, transparent)',
            }}
          />
        </div>
      </div>

      {/* Responsive logo sizing */}
      <style>{`
        .hero-logo-responsive { height: 100px; }
        @media (min-width: 640px)  { .hero-logo-responsive { height: 140px; } }
        @media (min-width: 1024px) { .hero-logo-responsive { height: 200px; } }
      `}</style>
    </section>
  );
}

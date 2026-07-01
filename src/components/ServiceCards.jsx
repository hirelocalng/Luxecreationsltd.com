import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SERVICES = [
  {
    id: 'events',
    href: '/events',
    eyebrow: 'Division I',
    title: 'Luxe Events',
    description:
      'We craft extraordinary events — weddings, corporate galas, product launches, and intimate celebrations — where every moment is intentional and every detail impeccable.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width={48} height={48}>
        <rect x="8" y="14" width="32" height="26" rx="2" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M16 14V10M32 14V10" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 22H40" stroke="#D9A521" strokeWidth="1.2" />
        <circle cx="20" cy="32" r="2" fill="#D9A521" />
        <circle cx="28" cy="32" r="2" fill="#D9A521" />
      </svg>
    ),
    cta: 'Explore Events',
  },
  {
    id: 'confectioneries',
    href: '/confectioneries',
    eyebrow: 'Division II',
    title: 'Luxe Confectioneries',
    description:
      'From towering wedding cakes to delicate pastries and bespoke dessert tables, our confections are as beautiful to behold as they are unforgettable to taste.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width={48} height={48}>
        <path d="M12 36 L12 24 C12 20.7 15.6 18 24 18 C32.4 18 36 20.7 36 24 L36 36" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 36 H40" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 18 C18 14 20 10 24 10 C28 10 30 14 30 18" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 10 L24 7" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="6" r="2" fill="#D9A521" />
      </svg>
    ),
    cta: 'Explore Confectioneries',
  },
  {
    id: 'designs',
    href: '/designs',
    eyebrow: 'Division III',
    title: 'Luxe Designs',
    description:
      'We build brands that command attention. From logo design and visual identity to marketing collateral and social media graphics, we make your brand as luxurious as your vision.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width={48} height={48}>
        <rect x="10" y="10" width="28" height="28" rx="2" stroke="#D9A521" strokeWidth="1.5" />
        <path d="M10 20 H38" stroke="#D9A521" strokeWidth="1.2" />
        <path d="M20 20 V38" stroke="#D9A521" strokeWidth="1.2" />
        <circle cx="15" cy="15" r="1.5" fill="#D9A521" />
        <circle cx="20" cy="15" r="1.5" fill="#D9A521" />
        <circle cx="25" cy="15" r="1.5" fill="#D9A521" />
      </svg>
    ),
    cta: 'Explore Designs',
  },
];

function ServiceCard({ id, href, eyebrow, title, description, icon, cta, image, revealClass }) {
  const [hovered, setHovered] = useState(false);

  const overlay = hovered
    ? 'linear-gradient(rgba(11,43,34,0.55), rgba(11,43,34,0.65))'
    : 'linear-gradient(rgba(11,43,34,0.75), rgba(11,43,34,0.85))';

  return (
    <div
      className={`service-card ${revealClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundImage: `${overlay}, url("${image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        border: '1px solid rgba(247,243,232,0.12)',
        borderRadius: 4,
        padding: '44px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transition: 'background-image 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{ marginBottom: 24 }}>{icon}</div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: '#D9A521',
        marginBottom: 10,
      }}>
        {eyebrow}
      </p>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 26,
        fontWeight: 600,
        color: '#F7F3E8',
        margin: '0 0 16px',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.75,
        color: 'rgba(247,243,232,0.75)',
        margin: '0 0 32px',
        flexGrow: 1,
      }}>
        {description}
      </p>
      <Link
        to={href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: hovered ? 14 : 8,
          color: '#D9A521',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body)',
          transition: 'gap 0.25s ease',
        }}
      >
        {cta}
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="M1 5H15M10 1L15 5L10 9" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

export default function ServiceCards() {
  const ref = useScrollReveal();

  return (
    <section
      aria-label="Our services"
      ref={ref}
      style={{ background: '#0B2B22', padding: '96px 24px' }}
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
            What We Do
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 600,
            color: '#F7F3E8',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Three Divisions. One Standard of Excellence.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
        }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              {...svc}
              revealClass={`reveal reveal-delay-${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

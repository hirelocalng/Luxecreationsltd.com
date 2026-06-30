import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

const FALLBACK_TESTIMONIALS = [
  {
    id: 'f1',
    quote:
      "Luxe Creations transformed my wedding into an absolute fairytale. Every detail was exquisite — from the décor to the cake. I didn't have to worry about a thing. They handled everything with such grace and professionalism. I still get compliments on my wedding today!",
    name: 'Adaeze Okafor',
    role: 'Bride',
    division: 'Luxe Events',
    rating: 5,
  },
  {
    id: 'f2',
    quote:
      "Our product launch was a massive success, and Luxe Creations deserves full credit. The branding they created was striking and memorable, and the event execution was flawless. Our guests were genuinely impressed. We'll be partnering with them for all future events.",
    name: 'Chukwuemeka Eze',
    role: 'CEO, Eze Group',
    division: 'Luxe Events & Designs',
    rating: 5,
  },
  {
    id: 'f3',
    quote:
      "The custom cake Luxe Confectioneries made for my 40th birthday was a masterpiece — it looked almost too beautiful to cut! The flavour was incredible too. Everyone at the party was talking about it. Luxe Creations is truly in a league of their own.",
    name: 'Ngozi Anyanwu',
    role: 'Birthday Celebrant',
    division: 'Luxe Confectioneries',
    rating: 5,
  },
];

function StarRating({ rating = 5 }) {
  return (
    <div aria-label={`${rating} out of 5 stars`} style={{ display: 'flex', gap: 3, marginBottom: 24 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={i < rating ? '#D9A521' : 'rgba(217,165,33,0.2)'}
          aria-hidden="true"
        >
          <path d="M8 1.5L9.5 6H14L10.5 8.7L12 13.5L8 10.8L4 13.5L5.5 8.7L2 6H6.5L8 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <div
      className="testimonial-card"
      style={{
        background: 'rgba(247,243,232,0.05)',
        border: '1px solid rgba(217,165,33,0.2)',
        borderRadius: 4,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <StarRating rating={item.rating} />

      <blockquote
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.8,
          color: 'rgba(247,243,232,0.85)',
          margin: '0 0 32px',
          padding: 0,
          border: 'none',
          flexGrow: 1,
        }}
      >
        "{item.quote}"
      </blockquote>

      <div style={{ width: 32, height: 1, background: '#D9A521', marginBottom: 20 }} />

      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#D9A521', margin: '0 0 2px' }}>
          {item.name}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(247,243,232,0.5)', margin: '0 0 4px' }}>
          {item.role}
        </p>
        {item.division && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(217,165,33,0.6)',
          }}>
            {item.division}
          </span>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderRadius: 4,
        height: 280,
        background: 'rgba(247,243,232,0.05)',
        border: '1px solid rgba(217,165,33,0.08)',
        animation: 'skeletonPulse 1.4s ease-in-out infinite',
      }}
    />
  );
}

export default function Testimonials() {
  const ref = useScrollReveal();
  const gridRef = useRef(null);
  const { items, loading } = useFetch(api.getTestimonials, FALLBACK_TESTIMONIALS);

  // Animate cards in whenever items are resolved (same pattern as Portfolio)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || loading) return;
    const cards = grid.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });
    const timer = setTimeout(() => {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, i * 80);
      });
    }, 40);
    return () => clearTimeout(timer);
  }, [items, loading]);

  return (
    <>
      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:.4} 50%{opacity:.75} }`}</style>

      <section
        id="testimonials"
        aria-label="Testimonials"
        ref={ref}
        style={{ background: '#0B2B22', padding: '96px 24px' }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p
              className="reveal"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#D9A521',
                marginBottom: 12,
              }}
            >
              Testimonials
            </p>
            <h2
              className="reveal reveal-delay-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 600,
                color: '#F7F3E8',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Voices of Those We've Served
            </h2>
          </div>

          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : items.map((item, i) => (
                  <TestimonialCard key={item.id} item={item} index={i} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}

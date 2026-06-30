import { useState, useEffect } from 'react';
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
  },
  {
    id: 'f2',
    quote:
      "Our product launch was a massive success, and Luxe Creations deserves full credit. The branding they created was striking and memorable, and the event execution was flawless. Our guests were genuinely impressed. We'll be partnering with them for all future events.",
    name: 'Chukwuemeka Eze',
    role: 'CEO, Eze Group',
  },
  {
    id: 'f3',
    quote:
      "The custom cake Luxe Confectioneries made for my 40th birthday was a masterpiece — it looked almost too beautiful to cut! The flavour was incredible too. Everyone at the party was talking about it. Luxe Creations is truly in a league of their own.",
    name: 'Ngozi Anyanwu',
    role: 'Birthday Celebrant',
  },
];

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0);
  const ref = useScrollReveal();
  const { items, loading } = useFetch(api.getTestimonials, FALLBACK_TESTIMONIALS);

  // Reset active index when items change (e.g. API returns more/fewer)
  useEffect(() => {
    setActive(0);
  }, [items]);

  // Auto-advance — pause while loading
  useEffect(() => {
    if (loading || items.length <= 1) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [loading, items.length]);

  // Clamp active in case item count changed
  const safeActive = Math.min(active, Math.max(0, items.length - 1));

  return (
    <section
      aria-label="Client testimonials"
      ref={ref}
      style={{ background: '#0B2B22', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
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
          Client Stories
        </p>
        <h2
          className="reveal reveal-delay-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            color: '#F7F3E8',
            margin: '0 0 56px',
            letterSpacing: '-0.02em',
          }}
        >
          What Our Clients Say
        </h2>

        {/* Carousel body */}
        <div
          className="reveal reveal-delay-2"
          style={{ position: 'relative', minHeight: loading ? 200 : undefined }}
        >
          {loading ? (
            /* Skeleton pulse while fetching */
            <div
              aria-hidden="true"
              style={{
                height: 200,
                background: 'rgba(247,243,232,0.04)',
                borderRadius: 4,
                animation: 'skeletonPulse 1.4s ease-in-out infinite',
              }}
            />
          ) : (
            items.map((t, i) => (
              <div
                key={t.id}
                aria-hidden={i !== safeActive}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: i === safeActive ? 1 : 0,
                  transform: i === safeActive ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  pointerEvents: i === safeActive ? 'auto' : 'none',
                }}
              >
                {/* Decorative opening quote */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 80,
                    lineHeight: 0.6,
                    color: 'rgba(217,165,33,0.25)',
                    marginBottom: 24,
                    userSelect: 'none',
                  }}
                >
                  "
                </div>

                <blockquote
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(17px, 2.2vw, 22px)',
                    lineHeight: 1.7,
                    color: '#F7F3E8',
                    margin: '0 0 32px',
                    padding: 0,
                    border: 'none',
                  }}
                >
                  {t.quote}
                </blockquote>

                <cite style={{ fontStyle: 'normal' }}>
                  <div
                    style={{ width: 40, height: 1, background: '#D9A521', margin: '0 auto 16px' }}
                  />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#D9A521', margin: '0 0 4px' }}>
                    {t.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(247,243,232,0.55)', margin: 0 }}>
                    {t.role}
                  </p>
                </cite>
              </div>
            ))
          )}
        </div>

        {/* Dot indicators — hidden while loading */}
        {!loading && items.length > 1 && (
          <div
            role="tablist"
            aria-label="Testimonial navigation"
            style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 48 }}
          >
            {items.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === safeActive}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setActive(i)}
                style={{
                  width: i === safeActive ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === safeActive ? '#D9A521' : 'rgba(217,165,33,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.35s ease, background 0.35s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes skeletonPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }`}</style>
    </section>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        position: 'relative',
        padding: '64px 24px 36px',
        borderTop: '1px solid rgba(217,165,33,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Background image — dark moody luxury marble */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Dark green overlay at 80% opacity */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,15,12,0.82)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48,
          marginBottom: 56,
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <img
              src="/assets/logo.png"
              alt="Luxe Creations Ltd"
              style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 20 }}
            />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.8,
              color: 'rgba(247,243,232,0.5)',
              margin: '0 0 24px',
              maxWidth: 240,
            }}>
              Creating memorable experiences, beautiful celebrations &amp;
              impactful brands across Nigeria.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['IG', 'FB', 'TW'].map((s) => (
                <a
                  key={s}
                  href="/#contact"
                  aria-label={s === 'IG' ? 'Instagram' : s === 'FB' ? 'Facebook' : 'Twitter'}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    border: '1px solid rgba(217,165,33,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(217,165,33,0.6)', fontSize: 10,
                    fontFamily: 'var(--font-body)', fontWeight: 700,
                    textDecoration: 'none', transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#D9A521';
                    e.target.style.color = '#D9A521';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(217,165,33,0.3)';
                    e.target.style.color = 'rgba(217,165,33,0.6)';
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Divisions */}
          <nav aria-label="Divisions navigation">
            <h3 style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#D9A521', margin: '0 0 20px',
            }}>
              Our Divisions
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Luxe Events', to: '/events' },
                { label: 'Luxe Confectioneries', to: '/confectioneries' },
                { label: 'Luxe Designs', to: '/designs' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} style={{
                    fontFamily: 'var(--font-body)', fontSize: 14,
                    color: 'rgba(247,243,232,0.55)', textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,243,232,0.55)')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <nav aria-label="Quick links navigation">
            <h3 style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#D9A521', margin: '0 0 20px',
            }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'About Us',      href: '/#about' },
                { label: 'Portfolio',     href: '/#portfolio' },
                { label: 'Testimonials',  href: '/#testimonials' },
                { label: 'FAQ',           href: '/#faq' },
                { label: 'Contact',       href: '/#contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a href={href} style={{
                    fontFamily: 'var(--font-body)', fontSize: 14,
                    color: 'rgba(247,243,232,0.55)', textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#D9A521')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(247,243,232,0.55)')}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#D9A521', margin: '0 0 20px',
            }}>
              Contact Info
            </h3>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Phone', value: '09063930552', href: 'tel:09063930552' },
                { label: 'WhatsApp', value: '+234 906 393 0552', href: 'https://wa.me/2349063930552', external: true },
                { label: 'Email', value: 'luxecreationsltd1@gmail.com', href: 'mailto:luxecreationsltd1@gmail.com' },
                { label: 'Address', value: 'Awka Road, Onitsha, Anambra State' },
              ].map(({ label, value, href, external }) => (
                <div key={label}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(247,243,232,0.3)', margin: '0 0 3px',
                  }}>
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: 13,
                        color: 'rgba(247,243,232,0.6)', textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = '#D9A521')}
                      onMouseLeave={(e) => (e.target.style.color = 'rgba(247,243,232,0.6)')}
                    >
                      {value}
                    </a>
                  ) : (
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      color: 'rgba(247,243,232,0.6)', margin: 0,
                    }}>
                      {value}
                    </p>
                  )}
                </div>
              ))}
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(247,243,232,0.07)',
          paddingTop: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(247,243,232,0.35)', margin: 0 }}>
            &copy; {year} Luxe Creations Ltd. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(247,243,232,0.25)', margin: 0 }}>
            Events · Confectioneries · Designs
          </p>
        </div>
      </div>
    </footer>
  );
}

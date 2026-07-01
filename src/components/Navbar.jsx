import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home',            href: '/',                isRoute: true  },
  { label: 'About',           href: '/#about',          isRoute: false },
  { label: 'Events',          href: '/events',          isRoute: true  },
  { label: 'Confectioneries', href: '/confectioneries', isRoute: true  },
  { label: 'Designs',         href: '/designs',         isRoute: true  },
  { label: 'Portfolio',       href: '/portfolio',        isRoute: true  },
  { label: 'Blog',            href: '/blog',            isRoute: true  },
  { label: 'Testimonials',    href: '/#testimonials',   isRoute: false },
  { label: 'FAQ',             href: '/#faq',            isRoute: false },
  { label: 'Contact',         href: '/#contact',        isRoute: false },
];

const navLinkStyle = {
  color: 'rgba(247,243,232,0.82)',
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  transition: 'color 0.2s ease',
  fontFamily: 'var(--font-body)',
};

const mobileNavLinkStyle = {
  display: 'block',
  padding: '12px 8px',
  color: 'rgba(247,243,232,0.85)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(247,243,232,0.06)',
  fontFamily: 'var(--font-body)',
  transition: 'color 0.2s ease',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
        background: scrolled ? 'rgba(11,43,34,0.97)' : 'transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(217,165,33,0.2)' : 'none',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Luxe Creations Ltd — home"
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
          >
            <img
              src="/assets/logo.png"
              alt="Luxe Creations Ltd"
              style={{ height: 44, width: 'auto', objectFit: 'contain' }}
            />
          </Link>

          {/* Desktop nav */}
          <ul
            role="list"
            style={{
              display: 'none',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              gap: 28,
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ label, href, isRoute }) => (
              <li key={href}>
                {isRoute ? (
                  <Link
                    to={href}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,243,232,0.82)')}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    style={navLinkStyle}
                    onMouseEnter={(e) => (e.target.style.color = '#D9A521')}
                    onMouseLeave={(e) => (e.target.style.color = 'rgba(247,243,232,0.82)')}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            to="/book"
            className="desktop-cta"
            style={{
              background: '#D9A521',
              color: '#0B2B22',
              padding: '10px 22px',
              borderRadius: 3,
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s ease, transform 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0c84a';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#D9A521';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Book Consultation
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="hamburger-btn"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
          >
            <span style={{
              display: 'block', width: 24, height: 2, background: '#D9A521',
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 24, height: 2, background: '#D9A521',
              opacity: menuOpen ? 0 : 1, transition: 'opacity 0.3s ease',
            }} />
            <span style={{
              display: 'block', width: 24, height: 2, background: '#D9A521',
              transition: 'transform 0.3s ease',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="mobile-menu-open"
            style={{
              background: 'rgba(11,43,34,0.98)',
              borderTop: '1px solid rgba(217,165,33,0.2)',
              padding: '16px 0 24px',
            }}
          >
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {NAV_LINKS.map(({ label, href, isRoute }) => (
                <li key={href}>
                  {isRoute ? (
                    <Link
                      to={href}
                      onClick={handleNavClick}
                      style={mobileNavLinkStyle}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(247,243,232,0.85)')}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      onClick={handleNavClick}
                      style={mobileNavLinkStyle}
                      onMouseEnter={(e) => (e.target.style.color = '#D9A521')}
                      onMouseLeave={(e) => (e.target.style.color = 'rgba(247,243,232,0.85)')}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
              <li style={{ paddingTop: 16 }}>
                <Link
                  to="/book"
                  onClick={handleNavClick}
                  style={{
                    display: 'block',
                    background: '#D9A521',
                    color: '#0B2B22',
                    padding: '12px 8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderRadius: 3,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .desktop-cta { display: inline-block !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .desktop-cta { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

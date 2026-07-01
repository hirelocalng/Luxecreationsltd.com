import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Portfolio from '../components/Portfolio';

export default function PortfolioPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      {/* Page hero */}
      <section style={{
        position: 'relative',
        background: '#0B2B22',
        padding: '140px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(247,243,232,0.03) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 500, height: 300,
          background: 'radial-gradient(ellipse, rgba(217,165,33,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 100, left: 'max(24px, calc(50% - 580px))', zIndex: 1 }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(217,165,33,0.7)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D9A521')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(217,165,33,0.7)')}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
              <path d="M13 5H1M6 1L1 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#D9A521', marginBottom: 20,
          }}>
            Our Work
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 88px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#F7F3E8', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Portfolio
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 560, margin: '0 auto',
          }}>
            Every project is a story — of vision, craft, and the pursuit of the
            extraordinary. Browse our work across events, confectioneries, and design.
          </p>
        </div>
      </section>

      {/* Full portfolio grid with filter pills */}
      <Portfolio />
    </Layout>
  );
}

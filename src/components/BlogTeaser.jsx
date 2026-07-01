import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { API_URL } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogTeaser() {
  const ref = useScrollReveal();
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/blog?limit=3`)
      .then(r => r.json())
      .then(({ data }) => { setPosts(data || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <section
      ref={ref}
      id="blog"
      aria-label="From the Blog"
      style={{ background: '#F7F3E8', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="reveal" style={{
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D9A521', marginBottom: 12,
          }}>
            From the Blog
          </p>
          <h2 className="reveal reveal-delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 600, color: '#0B2B22', margin: '0 0 16px', letterSpacing: '-0.01em',
          }}>
            Ideas, Inspiration & Updates
          </h2>
          <p className="reveal reveal-delay-2" style={{
            fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.7,
            color: 'rgba(11,43,34,0.55)', maxWidth: 540, margin: '0 auto',
          }}>
            Tips, behind-the-scenes stories, and creative inspiration from the Luxe team.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
        }}>
          {posts.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`reveal reveal-delay-${i + 1}`}
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <article
                style={{
                  background: '#fff', borderRadius: 6, overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(11,43,34,0.07)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex', flexDirection: 'column', width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 32px rgba(11,43,34,0.13)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(11,43,34,0.07)';
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: 200, background: 'rgba(11,43,34,0.08)', flexShrink: 0, overflow: 'hidden' }}>
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #0B2B22 0%, #1a4434 100%)',
                    }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.2 }}>
                        <path d="M4 6h16M4 10h16M4 14h10" stroke="#F7F3E8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: '#D9A521', margin: '0 0 10px',
                  }}>
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
                    color: '#0B2B22', margin: '0 0 10px', lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75,
                      color: 'rgba(11,43,34,0.6)', margin: '0 0 18px', flex: 1,
                    }}>
                      {post.excerpt}
                    </p>
                  )}
                  <span style={{
                    marginTop: 'auto',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0B2B22',
                  }}>
                    Read More
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                      <path d="M1 5H13M8 1L13 5L8 9" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 52 }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#0B2B22', textDecoration: 'none',
              borderBottom: '1.5px solid rgba(11,43,34,0.3)', paddingBottom: 2,
              transition: 'border-color 0.2s ease, gap 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D9A521';
              e.currentTarget.style.gap = '14px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(11,43,34,0.3)';
              e.currentTarget.style.gap = '8px';
            }}
          >
            View All Posts →
          </Link>
        </div>
      </div>
    </section>
  );
}

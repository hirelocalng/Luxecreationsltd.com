import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { API_URL } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function PostGrid({ posts }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 32,
    }}>
      {posts.map((post, i) => (
        <Link
          key={post.id}
          to={`/blog/${post.slug}`}
          className={`reveal reveal-delay-${(i % 3) + 1}`}
          style={{ textDecoration: 'none', display: 'flex' }}
        >
          <article
            style={{
              background: '#fff', borderRadius: 6, overflow: 'hidden',
              boxShadow: '0 2px 16px rgba(11,43,34,0.07)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              display: 'flex', flexDirection: 'column', width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 36px rgba(11,43,34,0.13)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 16px rgba(11,43,34,0.07)';
            }}
          >
            <div style={{ height: 220, background: 'rgba(11,43,34,0.08)', flexShrink: 0, overflow: 'hidden' }}>
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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.18 }}>
                    <path d="M4 6h16M4 10h16M4 14h10" stroke="#F7F3E8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
            <div style={{ padding: '24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#D9A521', margin: '0 0 10px',
              }}>
                {formatDate(post.published_at || post.created_at)}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 600,
                color: '#0B2B22', margin: '0 0 12px', lineHeight: 1.3,
              }}>
                {post.title}
              </h2>
              {post.excerpt && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.8,
                  color: 'rgba(11,43,34,0.6)', margin: '0 0 20px', flex: 1,
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
                Read Article
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 5H13M8 1L13 5L8 9" stroke="#D9A521" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/api/blog?limit=50`)
      .then(r => r.json())
      .then(({ data }) => { setPosts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* Hero */}
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
            The Luxe Blog
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 6vw, 72px)',
            fontWeight: 600, lineHeight: 1.1,
            color: '#F7F3E8', margin: '0 0 24px',
            letterSpacing: '-0.02em',
          }}>
            Ideas & Inspiration
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7, color: 'rgba(247,243,232,0.65)',
            maxWidth: 560, margin: '0 auto',
          }}>
            Behind-the-scenes stories, creative tips, and updates from the Luxe Creations team.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section style={{ background: '#F7F3E8', padding: '80px 24px 96px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 6, overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(11,43,34,0.07)',
                  animation: 'blogPulse 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ height: 220, background: 'rgba(11,43,34,0.07)' }} />
                  <div style={{ padding: '24px 26px' }}>
                    <div style={{ height: 11, width: '40%', background: 'rgba(11,43,34,0.07)', borderRadius: 3, marginBottom: 12 }} />
                    <div style={{ height: 24, width: '85%', background: 'rgba(11,43,34,0.09)', borderRadius: 3, marginBottom: 8 }} />
                    <div style={{ height: 14, width: '70%', background: 'rgba(11,43,34,0.06)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 16,
                color: 'rgba(11,43,34,0.4)', margin: 0,
              }}>
                No posts yet — check back soon.
              </p>
            </div>
          ) : (
            <PostGrid posts={posts} />
          )}
        </div>
      </section>

      <style>{`@keyframes blogPulse { 0%,100%{opacity:.45} 50%{opacity:.8} }`}</style>
    </Layout>
  );
}

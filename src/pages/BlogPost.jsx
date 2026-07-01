import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { API_URL } from '../utils/api';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => {
        if (data) { setPost(data); setLoading(false); }
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

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
          background: 'radial-gradient(ellipse, rgba(217,165,33,0.08) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Back link */}
        <div style={{ position: 'absolute', top: 100, left: 'max(24px, calc(50% - 580px))', zIndex: 1 }}>
          <Link
            to="/blog"
            style={{
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
            Back to Blog
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {loading ? (
            <>
              <div aria-hidden="true" style={{
                width: 140, height: 12, borderRadius: 4, margin: '0 auto 20px',
                background: 'rgba(247,243,232,0.1)',
                animation: 'bpPulse 1.4s ease-in-out infinite',
              }} />
              <div aria-hidden="true" style={{
                width: 480, maxWidth: '80%', height: 44, borderRadius: 4, margin: '0 auto',
                background: 'rgba(247,243,232,0.07)',
                animation: 'bpPulse 1.4s ease-in-out infinite',
              }} />
            </>
          ) : notFound ? (
            <>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(247,243,232,0.5)', margin: '0 0 16px' }}>
                Post not found
              </p>
              <Link to="/blog" style={{ color: '#D9A521', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>
                ← View all posts
              </Link>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#D9A521', marginBottom: 20,
              }}>
                {formatDate(post.published_at || post.created_at)}
              </p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4.5vw, 60px)',
                fontWeight: 600, lineHeight: 1.15,
                color: '#F7F3E8', margin: '0 auto',
                letterSpacing: '-0.02em', maxWidth: 820,
              }}>
                {post.title}
              </h1>
            </>
          )}
        </div>
      </section>

      {/* Content */}
      {!loading && !notFound && (
        <>
          {/* Featured image */}
          {post.featured_image && (
            <section style={{ background: '#0B2B22', padding: '0 24px 64px' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <img
                  src={post.featured_image}
                  alt={post.title}
                  style={{
                    width: '100%', maxHeight: 520, objectFit: 'cover',
                    objectPosition: 'center', borderRadius: 4, display: 'block',
                  }}
                />
              </div>
            </section>
          )}

          {/* Article body */}
          <section style={{ background: '#F7F3E8', padding: '64px 24px 96px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              {post.excerpt && (
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.75,
                  color: 'rgba(11,43,34,0.7)', fontStyle: 'italic',
                  margin: '0 0 40px', paddingBottom: 36,
                  borderBottom: '1px solid rgba(11,43,34,0.12)',
                }}>
                  {post.excerpt}
                </p>
              )}

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* Footer nav */}
              <div style={{
                marginTop: 64, paddingTop: 32,
                borderTop: '1px solid rgba(11,43,34,0.12)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
              }}>
                <Link
                  to="/blog"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: '#0B2B22', textDecoration: 'none',
                    transition: 'gap 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.gap = '14px')}
                  onMouseLeave={(e) => (e.currentTarget.style.gap = '8px')}
                >
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                    <path d="M13 5H1M6 1L1 5L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  All Posts
                </Link>
                <Link
                  to="/book"
                  style={{
                    display: 'inline-block', background: '#0B2B22', color: '#D9A521',
                    padding: '13px 32px', fontFamily: 'var(--font-body)',
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', textDecoration: 'none', borderRadius: 3,
                    transition: 'background 0.25s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0f3a2e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#0B2B22';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <style>{`
        @keyframes bpPulse { 0%,100%{opacity:.35} 50%{opacity:.65} }

        .blog-content {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.85;
          color: rgba(11,43,34,0.78);
          white-space: pre-line;
        }
        .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4 {
          font-family: var(--font-display);
          font-weight: 600;
          color: #0B2B22;
          margin: 2em 0 0.6em;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .blog-content h2 { font-size: clamp(22px, 3vw, 30px); }
        .blog-content h3 { font-size: clamp(18px, 2.5vw, 24px); }
        .blog-content h4 { font-size: 18px; }
        .blog-content p { margin: 0 0 1.5em; }
        .blog-content ul,.blog-content ol { padding-left: 1.5em; margin: 0 0 1.5em; }
        .blog-content li { margin-bottom: 0.4em; }
        .blog-content a { color: #D9A521; text-underline-offset: 3px; }
        .blog-content a:hover { color: #b8861a; }
        .blog-content blockquote {
          margin: 2em 0;
          padding: 20px 24px;
          border-left: 3px solid #D9A521;
          background: rgba(217,165,33,0.06);
          border-radius: 0 4px 4px 0;
          font-style: italic;
          color: rgba(11,43,34,0.7);
        }
        .blog-content img {
          max-width: 100%; height: auto; border-radius: 4px;
          margin: 1.5em 0; display: block;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(11,43,34,0.12);
          margin: 2.5em 0;
        }
        .blog-content strong { color: #0B2B22; font-weight: 600; }
        .blog-content code {
          background: rgba(11,43,34,0.06);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: "Courier New", monospace;
        }
      `}</style>
    </Layout>
  );
}

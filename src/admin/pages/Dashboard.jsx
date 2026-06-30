import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const QUICK = [
  { label: '+ New Blog Post',       to: '/admin/blog/new',     bg: '#0B2B22', color: '#fff' },
  { label: '+ Add Testimonial',     to: '/admin/testimonials', bg: '#D9A521', color: '#0B2B22' },
  { label: '+ Upload Portfolio',    to: '/admin/portfolio',    bg: '#C97B5E', color: '#fff' },
  { label: 'View Inquiries',        to: '/admin/inquiries',    bg: '#fff',    color: '#0B2B22', border: '1.5px solid #0B2B22' },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      adminApi.getInquiries({ limit: 1 }).catch(() => ({ total: 0 })),
      adminApi.getInquiries({ status: 'new', limit: 1 }).catch(() => ({ total: 0 })),
      adminApi.getTestimonials().catch(() => ({ data: [] })),
      adminApi.getPortfolio().catch(() => ({ data: [] })),
      adminApi.getBlogPosts().catch(() => ({ data: [] })),
      adminApi.getSubscribers().catch(() => ({ data: [] })),
    ]).then(([all, newInq, testimonials, portfolio, blog, subs]) => {
      setStats({
        total: all.total ?? 0,
        newInquiries: newInq.total ?? 0,
        testimonials: testimonials.data?.length ?? 0,
        portfolio: portfolio.data?.length ?? 0,
        posts: blog.data?.length ?? 0,
        subscribers: subs.data?.length ?? 0,
      });
    });
  }, []);

  const CARDS = stats ? [
    { label: 'Inquiries',     value: stats.total,        sub: `${stats.newInquiries} new`,  to: '/admin/inquiries',    accent: '#D9A521' },
    { label: 'Testimonials',  value: stats.testimonials, sub: 'in database',                to: '/admin/testimonials', accent: '#0B2B22' },
    { label: 'Portfolio',     value: stats.portfolio,    sub: 'items uploaded',             to: '/admin/portfolio',    accent: '#C97B5E' },
    { label: 'Blog Posts',    value: stats.posts,        sub: 'draft & published',          to: '/admin/blog',         accent: '#059669' },
    { label: 'Subscribers',   value: stats.subscribers,  sub: 'newsletter',                 to: '/admin/newsletter',   accent: '#7c3aed' },
  ] : [];

  return (
    <div>
      <p style={{ color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontSize: 13, margin: '0 0 4px' }}>
        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111827', margin: '0 0 28px' }}>
        Welcome back{admin?.email ? `, ${admin.email.split('@')[0]}` : ''}.
      </h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: 14, marginBottom: 36 }}>
        {!stats
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 108, background: '#e8e5df', borderRadius: 6, animation: 'pulse 1.4s ease infinite' }} />
            ))
          : CARDS.map(({ label, value, sub, to, accent }) => (
              <Link key={label} to={to} style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid #e8e5df', borderRadius: 6, padding: '18px 18px 14px', borderTop: `3px solid ${accent}` }}>
                <p style={{ color: '#6b7280', fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                  {label}
                </p>
                <p style={{ color: '#111827', fontSize: 34, fontWeight: 700, fontFamily: 'Inter, sans-serif', lineHeight: 1, margin: '0 0 4px' }}>
                  {value}
                </p>
                <p style={{ color: '#9ca3af', fontSize: 12, fontFamily: 'Inter, sans-serif', margin: 0 }}>{sub}</p>
              </Link>
            ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 14px' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {QUICK.map(({ label, to, bg, color, border }) => (
          <Link key={label} to={to} style={{
            padding: '9px 18px', background: bg, color, border: border || 'none',
            borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, textDecoration: 'none',
          }}>
            {label}
          </Link>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.45} 50%{opacity:.85} }`}</style>
    </div>
  );
}

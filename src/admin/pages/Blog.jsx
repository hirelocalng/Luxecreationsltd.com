import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const btn = (bg, color, extra = {}) => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', textDecoration: 'none', display: 'inline-block', ...extra });

export default function Blog() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getBlogPosts(filter || undefined); setPosts(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load posts'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  async function del(id) {
    if (!confirm('Delete this post permanently?')) return;
    try { await adminApi.deleteBlogPost(id); load(); }
    catch (e) { alert(e.message); }
  }

  const sel = { padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#fff' };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>
          Blog Posts <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 18 }}>({posts.length})</span>
        </h1>
        <Link to="/admin/blog/new" style={{ ...btn(GOLD, G), padding: '9px 20px', fontSize: 13 }}>+ New Post</Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={sel}>
          <option value="">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 64, background: '#e8e5df', borderRadius: 8, opacity: 0.6 }} />)}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 16px' }}>No posts yet.</p>
          <Link to="/admin/blog/new" style={btn(GOLD, G)}>Write First Post</Link>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e5df', background: '#fafaf9' }}>
                {['Title', 'Status', 'Published', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <p style={{ fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{p.title}</p>
                    {p.excerpt && <p style={{ color: '#9ca3af', fontSize: 12, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>{p.excerpt}</p>}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: p.status === 'published' ? '#d1fae5' : '#f3f4f6', color: p.status === 'published' ? '#065f46' : '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                    {p.published_at ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/blog/${p.id}/edit`} style={btn(G, '#fff', { fontSize: 11 })}>Edit</Link>
                      <button onClick={() => del(p.id)} style={btn('#fee2e2', '#991b1b', { fontSize: 11 })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

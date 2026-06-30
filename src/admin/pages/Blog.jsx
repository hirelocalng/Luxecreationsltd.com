import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Card, Badge,
  btnGold, btnDanger, btnEdit, btnGhost, selectStyle,
} from '../components/ui';

const STATUS_STYLE = {
  published: { bg: '#d1fae5', color: '#065f46' },
  draft:     { bg: '#f3f4f6', color: '#6b7280' },
};

export default function Blog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBlogPosts(filter || undefined);
      setPosts(res.data || []);
    } catch {
      toast('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!confirm('Delete this blog post permanently?')) return;
    try {
      await adminApi.deleteBlogPost(id);
      toast('Post deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  }

  return (
    <div>
      <PageHeader title="Blog Posts" count={posts.length}>
        <Link to="/admin/blog/new" style={{
          padding: '9px 20px', background: '#D9A521', color: '#0B2B22', border: 'none',
          borderRadius: 4, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          textDecoration: 'none', display: 'inline-block',
        }}>
          + New Post
        </Link>
      </PageHeader>

      <div style={{ marginBottom: 20 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}>
          <option value="">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {loading ? <LoadingRows n={5} /> : posts.length === 0 ? (
        <EmptyState message="No posts yet." />
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e5df' }}>
                {['Title', 'Division', 'Status', 'Published', ''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const s = STATUS_STYLE[post.status] || STATUS_STYLE.draft;
                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>{post.title}</p>
                      {post.excerpt && (
                        <p style={{ color: '#9ca3af', fontSize: 12, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 360 }}>
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Badge label={post.division || 'general'} />
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Badge label={post.status} bg={s.bg} color={s.color} />
                    </td>
                    <td style={{ padding: '13px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          style={{ ...btnEdit, textDecoration: 'none', display: 'inline-block' }}
                        >
                          Edit
                        </Link>
                        <button onClick={() => del(post.id)} style={btnDanger}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

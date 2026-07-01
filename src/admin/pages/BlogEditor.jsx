import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', outline: 'none' };
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 };

function slug(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default function BlogEditor() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', featured_image: '', status: 'draft', published_at: '' });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!id) return;
    adminApi.getBlogPosts().then(r => {
      const p = (r.data || []).find(x => String(x.id) === id);
      if (p) setForm({ title: p.title || '', excerpt: p.excerpt || '', content: p.content || '', featured_image: p.featured_image || '', status: p.status || 'draft', published_at: p.published_at ? p.published_at.slice(0, 10) : '' });
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(status) {
    if (!form.title || !form.content) return setError('Title and content are required');
    setSaving(true); setError('');
    const payload = { ...form, status, published_at: status === 'published' && !form.published_at ? new Date().toISOString().slice(0, 10) : form.published_at };
    try {
      if (id) await adminApi.updateBlogPost(id, payload);
      else await adminApi.createBlogPost(payload);
      navigate('/admin/blog');
    } catch (e) { setError(e.message || 'Save failed'); }
    finally { setSaving(false); }
  }

  if (loading) return <div style={{ padding: 40, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 780, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>{id ? 'Edit Post' : 'New Post'}</h1>
        <button onClick={() => navigate('/admin/blog')} style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>← Back</button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 20, fontSize: 14 }}>{error}</div>}

      <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={lbl}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} style={inp} placeholder="Post title…" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={lbl}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inp }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Publish Date</label>
            <input type="date" value={form.published_at} onChange={e => set('published_at', e.target.value)} style={inp} />
          </div>
        </div>

        <div>
          <label style={lbl}>Cover Image URL</label>
          <input value={form.featured_image} onChange={e => set('featured_image', e.target.value)} style={inp} placeholder="https://…" />
          {form.featured_image && <img src={form.featured_image} alt="" style={{ marginTop: 10, width: '100%', aspectRatio: '16/6', objectFit: 'cover', borderRadius: 6 }} />}
        </div>

        <div>
          <label style={lbl}>Excerpt <span style={{ fontWeight: 400, color: '#9ca3af' }}>(shown in listings)</span></label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Short summary…" />
        </div>

        <div>
          <label style={lbl}>Content * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(plain text, Markdown, or HTML)</span></label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={20} style={{ ...inp, resize: 'vertical', fontFamily: '"Courier New", monospace', lineHeight: 1.7 }} placeholder="Write your article here…" />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => submit('draft')} disabled={saving} style={{ padding: '9px 20px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Save Draft
          </button>
          <button onClick={() => submit('published')} disabled={saving} style={{ padding: '9px 20px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

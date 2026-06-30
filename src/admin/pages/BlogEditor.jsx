import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { FormField, Card, btnPrimary, btnGhost, inputStyle, selectStyle } from '../components/ui';

// Backend columns: title, slug (auto-generated), content, excerpt, featured_image,
//                  meta_title, meta_description, status, published_at

const BLANK = {
  title: '', excerpt: '', content: '',
  featured_image: '', status: 'draft', published_at: '',
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminApi.getBlogPosts().then(res => {
      const post = (res.data || []).find(p => String(p.id) === id);
      if (post) {
        setForm({
          title:         post.title || '',
          excerpt:       post.excerpt || '',
          content:       post.content || '',
          featured_image:post.featured_image || '',
          status:        post.status || 'draft',
          published_at:  post.published_at ? post.published_at.slice(0, 10) : '',
        });
      }
    }).catch(() => toast('Failed to load post', 'error')).finally(() => setLoading(false));
  }, [id, toast]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(status) {
    const payload = { ...form, status };
    if (status === 'published' && !payload.published_at) {
      payload.published_at = new Date().toISOString().slice(0, 10);
    }
    if (!payload.title || !payload.content) {
      toast('Title and content are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (id) {
        await adminApi.updateBlogPost(id, payload);
        toast('Post updated');
      } else {
        await adminApi.createBlogPost(payload);
        toast('Post created');
      }
      navigate('/admin/blog');
    } catch (e) {
      toast(e.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif', color: '#9ca3af' }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>
          {id ? 'Edit Post' : 'New Post'}
        </h1>
        <button onClick={() => navigate('/admin/blog')} style={btnGhost}>← Back</button>
      </div>

      <Card style={{ padding: 28 }}>
        <FormField label="Title *">
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            style={inputStyle}
            placeholder="Post title…"
          />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...selectStyle, width: '100%' }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </FormField>
          <FormField label="Publish Date">
            <input
              type="date"
              value={form.published_at}
              onChange={e => set('published_at', e.target.value)}
              style={inputStyle}
            />
          </FormField>
        </div>

        <FormField label="Cover / Featured Image URL">
          <input
            value={form.featured_image}
            onChange={e => set('featured_image', e.target.value)}
            style={inputStyle}
            placeholder="https://…"
          />
          {form.featured_image && (
            <img
              src={form.featured_image}
              alt=""
              style={{ marginTop: 10, width: '100%', aspectRatio: '16/6', objectFit: 'cover', borderRadius: 6 }}
            />
          )}
        </FormField>

        <FormField label="Excerpt" hint="Short summary shown in post listings">
          <textarea
            value={form.excerpt}
            onChange={e => set('excerpt', e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
            placeholder="Short summary…"
          />
        </FormField>

        <FormField label="Content *" hint="Plain text, Markdown, or HTML">
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={20}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: '"Courier New", monospace', fontSize: 13, lineHeight: 1.6 }}
            placeholder="Write your article here…"
          />
        </FormField>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button onClick={() => submit('draft')} disabled={saving} style={btnGhost}>
            Save Draft
          </button>
          <button onClick={() => submit('published')} disabled={saving} style={btnPrimary}>
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </Card>
    </div>
  );
}

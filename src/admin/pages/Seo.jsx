import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', outline: 'none' };
const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', fontFamily: 'Inter, sans-serif', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };

const PAGE_LABELS = {
  home: 'Home (/)', about: 'About (/#about)', events: 'Events (/events)',
  confectioneries: 'Confectioneries (/confectioneries)', designs: 'Designs (/designs)',
  portfolio: 'Portfolio (/#portfolio)', blog: 'Blog (/blog)',
};

export default function Seo() {
  const [pages, setPages]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editing, setEditing] = useState(null); // page_key of open editor
  const [drafts, setDrafts]   = useState({});   // { page_key: { meta_title, meta_description } }
  const [saving, setSaving]   = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getAllSeo(); setPages(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load SEO settings'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openEdit(p) {
    setEditing(p.page_key);
    setDrafts(d => ({ ...d, [p.page_key]: { meta_title: p.meta_title || '', meta_description: p.meta_description || '' } }));
  }

  async function save(page_key) {
    setSaving(page_key);
    try {
      await adminApi.updateSeo(page_key, drafts[page_key]);
      setEditing(null); load();
    } catch (e) { alert(e.message); }
    finally { setSaving(''); }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>SEO Settings</h1>
      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>Meta title (max 60 chars) and description (max 160 chars) for each page.</p>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(7)].map((_, i) => <div key={i} style={{ height: 72, background: '#e8e5df', borderRadius: 8, opacity: 0.6 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pages.map(p => (
            <div key={p.page_key} style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: '16px 20px' }}>
              {editing === p.page_key ? (
                <div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: GOLD, margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {PAGE_LABELS[p.page_key] || p.page_key}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={lbl}>Meta Title
                        <span style={{ color: (drafts[p.page_key]?.meta_title || '').length > 60 ? '#ef4444' : '#9ca3af', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                          {' '}({(drafts[p.page_key]?.meta_title || '').length}/60)
                        </span>
                      </label>
                      <input
                        value={drafts[p.page_key]?.meta_title || ''}
                        onChange={e => setDrafts(d => ({ ...d, [p.page_key]: { ...d[p.page_key], meta_title: e.target.value } }))}
                        style={{ ...inp, borderColor: (drafts[p.page_key]?.meta_title || '').length > 60 ? '#ef4444' : undefined }}
                        maxLength={80}
                      />
                    </div>
                    <div>
                      <label style={lbl}>Meta Description
                        <span style={{ color: (drafts[p.page_key]?.meta_description || '').length > 160 ? '#ef4444' : '#9ca3af', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                          {' '}({(drafts[p.page_key]?.meta_description || '').length}/160)
                        </span>
                      </label>
                      <textarea
                        value={drafts[p.page_key]?.meta_description || ''}
                        onChange={e => setDrafts(d => ({ ...d, [p.page_key]: { ...d[p.page_key], meta_description: e.target.value } }))}
                        rows={3}
                        style={{ ...inp, resize: 'vertical', borderColor: (drafts[p.page_key]?.meta_description || '').length > 160 ? '#ef4444' : undefined }}
                        maxLength={200}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={() => setEditing(null)} style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                      <button onClick={() => save(p.page_key)} disabled={saving === p.page_key} style={{ padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        {saving === p.page_key ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>{PAGE_LABELS[p.page_key] || p.page_key}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Georgia, serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.meta_title || <em style={{ color: '#d1d5db', fontStyle: 'normal' }}>No title</em>}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                      {p.meta_description || <em>No description</em>}
                    </p>
                  </div>
                  <button onClick={() => openEdit(p)} style={{ padding: '7px 16px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

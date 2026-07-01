import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const btn = (bg, color, extra = {}) => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', ...extra });
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

const CATS = ['events', 'confectioneries', 'designs', 'other'];

export default function Portfolio() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [catF, setCatF]       = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getPortfolio(); setItems(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load portfolio'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm('Delete this image? It will be removed from Cloudinary.')) return;
    try { await adminApi.deletePortfolioItem(id); load(); }
    catch (e) { alert(e.message); }
  }

  async function upload(formData) {
    try { await adminApi.createPortfolioItem(formData); setShowUpload(false); load(); }
    catch (e) { alert(e.message); }
  }

  async function update(id, body) {
    try { await adminApi.updatePortfolioItem(id, body); setEditing(null); load(); }
    catch (e) { alert(e.message); }
  }

  const visible = catF ? items.filter(x => x.category === catF) : items;
  const sel = { padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#fff' };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>
          Portfolio <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 18 }}>({items.length})</span>
        </h1>
        <button onClick={() => setShowUpload(true)} style={btn(GOLD, G)}>+ Upload Image</button>
      </div>

      {/* Category filter */}
      <div style={{ marginBottom: 20 }}>
        <select value={catF} onChange={e => setCatF(e.target.value)} style={sel}>
          <option value="">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ aspectRatio: '4/3', background: '#e8e5df', borderRadius: 8, opacity: 0.6 }} />)}
        </div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 16px' }}>{catF ? `No ${catF} images yet.` : 'No portfolio items yet.'}</p>
          <button onClick={() => setShowUpload(true)} style={btn(GOLD, G)}>Upload First Image</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {visible.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, overflow: 'hidden' }}>
              <img src={item.image_url} alt={item.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                  {item.title || '(untitled)'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontWeight: 600, textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}>
                    {item.category}
                  </span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setEditing(item)} style={btn(G, '#fff', { padding: '4px 10px', fontSize: 11 })}>Edit</button>
                    <button onClick={() => del(item.id)} style={btn('#fee2e2', '#991b1b', { padding: '4px 10px', fontSize: 11 })}>Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && <UploadModal onUpload={upload} onClose={() => setShowUpload(false)} />}
      {editing && <EditModal item={editing} onSave={update} onClose={() => setEditing(null)} />}
    </div>
  );
}

function UploadModal({ onUpload, onClose }) {
  const [file, setFile]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle]   = useState('');
  const [cat, setCat]       = useState('events');
  const [saving, setSaving] = useState(false);
  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

  function pickFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit() {
    if (!file || !title) return alert('Image and title required');
    setSaving(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', title);
    fd.append('category', cat);
    await onUpload(fd);
    setSaving(false);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 480 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, margin: 0, color: '#111827' }}>Upload Image</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 24, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {preview && <img src={preview} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 }} />}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Image File *</label>
            <input type="file" accept="image/*" onChange={pickFile} style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }} />
          </div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={inp} placeholder="e.g. Ngozi & Emeka Wedding" /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inp }}>
              {['events', 'confectioneries', 'designs', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
            <button onClick={submit} disabled={saving} style={{ padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {saving ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ item, onSave, onClose }) {
  const [title, setTitle] = useState(item.title || '');
  const [cat, setCat]     = useState(item.category || 'events');
  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 400 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, margin: 0, color: '#111827' }}>Edit Item</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 24, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <img src={item.image_url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6 }} />
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={inp} /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)} style={inp}>
              {['events', 'confectioneries', 'designs', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
            <button onClick={() => onSave(item.id, { title, category: cat })} style={{ padding: '8px 16px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

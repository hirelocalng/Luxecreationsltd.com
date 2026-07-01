import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';

const G = '#0B2B22', GOLD = '#D9A521';
const btn = (bg, color, extra = {}) => ({
  padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4,
  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', ...extra,
});
const inp = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4,
  fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
};

const DIVISION_LABELS = {
  events: 'Events',
  confectioneries: 'Confectioneries',
  designs: 'Designs',
};

export default function DivisionMediaPage({ division }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const fileRef = useRef();

  const label = DIVISION_LABELS[division] || division;

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminApi.getDivisionMedia(division);
      setItems(data || []);
    } catch {
      toast('Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [division]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('media', file);
      fd.append('division', division);
      if (title.trim()) fd.append('title', title.trim());
      await adminApi.createDivisionMedia(fd);
      setShowModal(false);
      setFile(null);
      setTitle('');
      if (fileRef.current) fileRef.current.value = '';
      await load();
      toast('Uploaded successfully', 'success');
    } catch {
      toast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  async function togglePublished(item) {
    try {
      const updated = await adminApi.updateDivisionMedia(item.id, { published: !item.published });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: updated.published } : i));
    } catch {
      toast('Failed to update', 'error');
    }
  }

  async function saveTitle(item) {
    try {
      const updated = await adminApi.updateDivisionMedia(item.id, { title: editItem.title });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, title: updated.title } : i));
      setEditItem(null);
      toast('Saved', 'success');
    } catch {
      toast('Save failed', 'error');
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.title || 'this item'}"? It will be removed from Cloudinary.`)) return;
    try {
      await adminApi.deleteDivisionMedia(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      toast('Deleted', 'success');
    } catch {
      toast('Delete failed', 'error');
    }
  }

  async function moveItem(item, dir) {
    const idx = items.findIndex(i => i.id === item.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const swap = items[swapIdx];
    try {
      await Promise.all([
        adminApi.updateDivisionMedia(item.id, { sort_order: swapIdx }),
        adminApi.updateDivisionMedia(swap.id, { sort_order: idx }),
      ]);
      await load();
    } catch {
      toast('Reorder failed', 'error');
    }
  }

  function closeModal() {
    setShowModal(false);
    setFile(null);
    setTitle('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, color: G, margin: '0 0 4px' }}>
            {label} Media
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(11,43,34,0.5)', fontFamily: 'Inter, sans-serif' }}>
            Upload images and videos for the {label} division gallery
          </p>
        </div>
        <button style={btn(G, GOLD)} onClick={() => setShowModal(true)}>
          + Upload Media
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              background: '#f3f4f6', borderRadius: 8, height: 220,
              animation: 'dmPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 24px', background: '#f9fafb',
          borderRadius: 8, border: '2px dashed #e5e7eb',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(11,43,34,0.4)', margin: 0 }}>
            No media yet — click "Upload Media" to add images or videos.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{
              background: '#fff', borderRadius: 8,
              border: '1px solid #e5e7eb', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
              opacity: item.published ? 1 : 0.6,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Thumbnail */}
              <div style={{ position: 'relative', height: 140, background: '#f3f4f6', flexShrink: 0 }}>
                {item.media_type === 'video' ? (
                  <>
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(0,0,0,0.3)',
                    }}>
                      <span style={{ fontSize: 26, color: '#fff', lineHeight: 1 }}>▶</span>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.media_url}
                    alt={item.title || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <span style={{
                  position: 'absolute', top: 6, left: 6,
                  background: item.media_type === 'video' ? G : GOLD,
                  color: item.media_type === 'video' ? GOLD : G,
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                  padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.media_type}
                </span>
              </div>

              {/* Info + actions */}
              <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {editItem?.id === item.id ? (
                  <div style={{ display: 'flex', gap: 5 }}>
                    <input
                      style={{ ...inp, padding: '5px 8px', fontSize: 12, flex: 1 }}
                      value={editItem.title}
                      onChange={(e) => setEditItem(prev => ({ ...prev, title: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(item); if (e.key === 'Escape') setEditItem(null); }}
                      autoFocus
                    />
                    <button style={btn(G, GOLD, { padding: '5px 8px' })} onClick={() => saveTitle(item)}>✓</button>
                    <button style={btn('#e5e7eb', G, { padding: '5px 8px' })} onClick={() => setEditItem(null)}>✕</button>
                  </div>
                ) : (
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: G,
                    margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.title || <span style={{ color: 'rgba(11,43,34,0.3)', fontStyle: 'italic' }}>Untitled</span>}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <button
                    style={btn(item.published ? '#dcfce7' : '#f3f4f6', item.published ? '#166534' : '#6b7280', { fontSize: 11, padding: '4px 8px' })}
                    onClick={() => togglePublished(item)}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </button>
                  <button
                    style={btn('#f0f9ff', '#0369a1', { fontSize: 11, padding: '4px 8px' })}
                    onClick={() => setEditItem({ id: item.id, title: item.title || '' })}
                  >
                    Edit
                  </button>
                  <button
                    style={btn('#fef2f2', '#dc2626', { fontSize: 11, padding: '4px 8px' })}
                    onClick={() => handleDelete(item)}
                  >
                    Del
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 5 }}>
                  <button
                    style={btn('#f3f4f6', G, { fontSize: 11, padding: '3px 0', flex: 1, opacity: idx === 0 ? 0.4 : 1 })}
                    onClick={() => moveItem(item, -1)}
                    disabled={idx === 0}
                  >
                    ↑
                  </button>
                  <button
                    style={btn('#f3f4f6', G, { fontSize: 11, padding: '3px 0', flex: 1, opacity: idx === items.length - 1 ? 0.4 : 1 })}
                    onClick={() => moveItem(item, 1)}
                    disabled={idx === items.length - 1}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{
            background: '#fff', borderRadius: 8, padding: 28,
            width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: G, fontSize: 18, margin: '0 0 20px' }}>
              Upload {label} Media
            </h2>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: G, marginBottom: 5 }}>
                  File (image or video) *
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  style={inp}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(11,43,34,0.45)', margin: '5px 0 0' }}>
                  Max 100 MB. Images and videos accepted.
                </p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: G, marginBottom: 5 }}>
                  Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wedding Reception 2024"
                  style={inp}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" style={btn('#f3f4f6', G)} onClick={closeModal} disabled={uploading}>
                  Cancel
                </button>
                <button type="submit" style={btn(G, GOLD, { opacity: (uploading || !file) ? 0.6 : 1 })} disabled={uploading || !file}>
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes dmPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  );
}

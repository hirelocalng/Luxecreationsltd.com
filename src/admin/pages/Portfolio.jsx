import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Modal, FormField,
  Badge, btnPrimary, btnGold, btnDanger, btnEdit, btnGhost, inputStyle, selectStyle,
} from '../components/ui';

const CATEGORIES = ['events', 'confectioneries', 'designs', 'other'];

export default function Portfolio() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | item

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPortfolio();
      setItems(res.data || []);
    } catch {
      toast('Failed to load portfolio', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function save(formData, editId) {
    try {
      if (editId) {
        // PUT only accepts JSON (no re-upload), so send plain object
        const body = Object.fromEntries(formData.entries());
        delete body.image; // not accepted in PUT
        await adminApi.updatePortfolioItem(editId, body);
        toast('Portfolio item updated');
      } else {
        await adminApi.createPortfolioItem(formData);
        toast('Portfolio item uploaded');
      }
      setModal(null);
      load();
    } catch (e) {
      toast(e.message || 'Upload failed', 'error');
    }
  }

  async function del(id) {
    if (!confirm('Delete this portfolio item? The image will be removed from Cloudinary.')) return;
    try {
      await adminApi.deletePortfolioItem(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  }

  return (
    <div>
      <PageHeader title="Portfolio" count={items.length}>
        <button onClick={() => setModal('add')} style={btnGold}>+ Upload Image</button>
      </PageHeader>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/3', background: '#e8e5df', borderRadius: 8, animation: 'pulse 1.4s ease infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
          <style>{`@keyframes pulse{0%,100%{opacity:.45}50%{opacity:.85}}`}</style>
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No portfolio items yet." onAction={() => setModal('add')} actionLabel="Upload First Image" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e5df', background: '#f9fafb' }}
            >
              <img
                src={item.image_url}
                alt={item.title || ''}
                style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title || '(untitled)'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge label={item.category || 'other'} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setModal(item)} style={{ ...btnEdit, padding: '4px 10px', fontSize: 11 }}>Edit</button>
                    <button onClick={() => del(item.id)} style={{ ...btnDanger, padding: '4px 10px', fontSize: 11 }}>Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <PortfolioModal
          item={modal === 'add' ? null : modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function PortfolioModal({ item, onSave, onClose }) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || 'events');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(item?.image_url || null);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function submit() {
    if (!item && !file) return;
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('category', category);
    if (file) fd.append('image', file);
    onSave(fd, item?.id || null);
  }

  return (
    <Modal title={item ? 'Edit Portfolio Item' : 'Upload Portfolio Image'} onClose={onClose}>
      {preview && (
        <img src={preview} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6, marginBottom: 16 }} />
      )}
      {!item && (
        <FormField label="Image *">
          <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 13, fontFamily: 'Inter, sans-serif' }} />
        </FormField>
      )}
      <FormField label="Title">
        <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Ngozi & Emeka Wedding" />
      </FormField>
      <FormField label="Category">
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...selectStyle, width: '100%' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </FormField>
      <FormField label="Description">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          placeholder="Brief description…"
        />
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={submit} style={btnPrimary}>{item ? 'Update' : 'Upload'}</button>
      </div>
    </Modal>
  );
}

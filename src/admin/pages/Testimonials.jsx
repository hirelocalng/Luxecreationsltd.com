import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const btn = (bg, color, extra = {}) => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', ...extra });
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', outline: 'none' };

const BLANK = { name: '', role: '', quote: '', division: 'events', published: true };

export default function Testimonials() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [modal, setModal]     = useState(null); // null | 'new' | item

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getTestimonials(); setItems(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function save(form) {
    try {
      if (form.id) await adminApi.updateTestimonial(form.id, form);
      else await adminApi.createTestimonial(form);
      setModal(null); load();
    } catch (e) { alert(e.message); }
  }

  async function toggle(item) {
    try { await adminApi.updateTestimonial(item.id, { published: !item.published }); load(); }
    catch (e) { alert(e.message); }
  }

  async function del(id) {
    if (!confirm('Delete this testimonial?')) return;
    try { await adminApi.deleteTestimonial(id); load(); }
    catch (e) { alert(e.message); }
  }

  async function move(idx, dir) {
    const next = [...items];
    const t = idx + dir;
    if (t < 0 || t >= next.length) return;
    [next[idx], next[t]] = [next[t], next[idx]];
    setItems(next);
    try { await adminApi.reorderTestimonials(next.map((x, i) => ({ id: x.id, sort_order: i }))); }
    catch { load(); }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>
          Testimonials <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 18 }}>({items.length})</span>
        </h1>
        <button onClick={() => setModal('new')} style={btn(GOLD, G)}>+ Add Testimonial</button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ height: 80, background: '#e8e5df', borderRadius: 8, opacity: 0.6 }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 16px' }}>No testimonials yet.</p>
          <button onClick={() => setModal('new')} style={btn(GOLD, G)}>Add First Testimonial</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, idx) => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Order arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0} style={btn('#f3f4f6', '#374151', { width: 26, height: 26, padding: 0, fontSize: 10, opacity: idx === 0 ? 0.4 : 1 })}>▲</button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} style={btn('#f3f4f6', '#374151', { width: 26, height: 26, padding: 0, fontSize: 10, opacity: idx === items.length - 1 ? 0.4 : 1 })}>▼</button>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 15, color: '#111827' }}>{item.name}</span>
                  {item.role && <span style={{ fontSize: 12, color: '#9ca3af' }}>{item.role}</span>}
                  <span style={{ padding: '2px 8px', borderRadius: 20, background: '#f3f4f6', color: '#374151', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{item.division}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 20, background: item.published ? '#d1fae5' : '#f3f4f6', color: item.published ? '#065f46' : '#6b7280', fontSize: 11, fontWeight: 600 }}>
                    {item.published ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>"{item.quote}"</p>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggle(item)} style={btn('#f3f4f6', '#374151', { fontSize: 11 })}>{item.published ? 'Hide' : 'Show'}</button>
                <button onClick={() => setModal(item)} style={btn(G, '#fff', { fontSize: 11 })}>Edit</button>
                <button onClick={() => del(item.id)} style={btn('#fee2e2', '#991b1b', { fontSize: 11 })}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <TestimonialModal
          initial={modal === 'new' ? BLANK : modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function TestimonialModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ id: initial.id, name: initial.name || '', role: initial.role || '', quote: initial.quote || '', division: initial.division || 'events', published: initial.published !== false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sel = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 500 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, margin: 0, color: '#111827' }}>{form.id ? 'Edit' : 'Add'} Testimonial</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 24, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Client Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} style={inp} placeholder="e.g. Adaeze Okonkwo" /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Role / Company</label>
            <input value={form.role} onChange={e => set('role', e.target.value)} style={inp} placeholder="e.g. Bride, Lagos 2024" /></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Division</label>
            <select value={form.division} onChange={e => set('division', e.target.value)} style={sel}>
              <option value="events">Events</option>
              <option value="confectioneries">Confectioneries</option>
              <option value="designs">Designs</option>
            </select></div>
          <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>Quote *</label>
            <textarea value={form.quote} onChange={e => set('quote', e.target.value)} rows={4} style={{ ...inp, resize: 'vertical' }} placeholder="The testimonial text…" /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151' }}>
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} /> Show on website
          </label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button onClick={onClose} style={btn('#f3f4f6', '#374151')}>Cancel</button>
            <button onClick={() => { if (!form.name || !form.quote) return alert('Name and quote required'); onSave(form); }} style={btn(G, '#fff')}>
              {form.id ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

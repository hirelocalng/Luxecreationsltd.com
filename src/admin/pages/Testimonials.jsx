import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Modal, FormField, Card,
  Badge, btnPrimary, btnGold, btnDanger, btnEdit, btnGhost, arrowBtn, inputStyle, selectStyle,
} from '../components/ui';

// Backend columns: name, role, division, quote, rating, sort_order, published
const BLANK = { name: '', role: '', body: '', division: 'events', published: true };

export default function Testimonials() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTestimonials();
      setItems(res.data || []);
    } catch {
      toast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function save(form) {
    try {
      if (form.id) {
        await adminApi.updateTestimonial(form.id, form);
        toast('Testimonial updated');
      } else {
        await adminApi.createTestimonial(form);
        toast('Testimonial added');
      }
      setModal(null);
      load();
    } catch {
      toast('Save failed', 'error');
    }
  }

  async function toggleActive(item) {
    try {
      await adminApi.updateTestimonial(item.id, { published: !item.published });
      toast(item.published ? 'Hidden' : 'Published');
      load();
    } catch {
      toast('Update failed', 'error');
    }
  }

  async function del(id) {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await adminApi.deleteTestimonial(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  }

  async function move(idx, dir) {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    try {
      await adminApi.reorderTestimonials(next.map((t, i) => ({ id: t.id, sort_order: i })));
    } catch {
      toast('Reorder failed', 'error');
      load();
    }
  }

  return (
    <div>
      <PageHeader title="Testimonials" count={items.length}>
        <button onClick={() => setModal('add')} style={btnGold}>+ Add Testimonial</button>
      </PageHeader>

      {loading ? <LoadingRows n={4} /> : items.length === 0 ? (
        <EmptyState message="No testimonials yet." onAction={() => setModal('add')} actionLabel="Add First Testimonial" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, idx) => (
            <Card key={item.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                <button onClick={() => move(idx, -1)} disabled={idx === 0} style={arrowBtn} title="Move up">▲</button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} style={arrowBtn} title="Move down">▼</button>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: 15, color: '#111827' }}>{item.name}</span>
                  {item.role && (
                    <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>{item.role}</span>
                  )}
                  {item.division && <Badge label={item.division} />}
                  {item.published
                    ? <Badge label="Published" bg="#d1fae5" color="#065f46" />
                    : <Badge label="Hidden" bg="#f3f4f6" color="#6b7280" />}
                </div>
                <p style={{ fontSize: 14, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                  "{item.quote}"
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => toggleActive(item)} style={btnEdit}>
                  {item.published ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => setModal(item)} style={btnEdit}>Edit</button>
                <button onClick={() => del(item.id)} style={btnDanger}>Del</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <TestimonialModal
          initial={modal === 'add' ? BLANK : modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function TestimonialModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    id:        initial.id,
    name:      initial.name || '',
    role:      initial.role || '',
    quote:     initial.quote || '',
    division:  initial.division || 'events',
    published: initial.published !== undefined ? initial.published : true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={form.id ? 'Edit Testimonial' : 'Add Testimonial'} onClose={onClose}>
      <FormField label="Author Name *">
        <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="e.g. Adaeze Okonkwo" />
      </FormField>
      <FormField label="Author Role / Company">
        <input value={form.role} onChange={e => set('role', e.target.value)} style={inputStyle} placeholder="e.g. Bride, Lagos 2024" />
      </FormField>
      <FormField label="Division">
        <select value={form.division} onChange={e => set('division', e.target.value)} style={{ ...selectStyle, width: '100%' }}>
          <option value="events">Events</option>
          <option value="confectioneries">Confectioneries</option>
          <option value="designs">Designs</option>
        </select>
      </FormField>
      <FormField label="Testimonial Text *">
        <textarea
          value={form.quote}
          onChange={e => set('quote', e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          placeholder="The testimonial quote…"
        />
      </FormField>
      <FormField label="Visibility">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151' }}>
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />
          Visible on website
        </label>
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button
          onClick={() => { if (!form.name || !form.quote) return; onSave(form); }}
          style={btnPrimary}
        >
          {form.id ? 'Update' : 'Add'}
        </button>
      </div>
    </Modal>
  );
}

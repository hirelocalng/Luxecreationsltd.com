import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Modal, FormField, Card,
  Badge, btnPrimary, btnGold, btnDanger, btnEdit, btnGhost, inputStyle, selectStyle,
} from '../components/ui';

// Backend columns: division, title, description, sort_order, active
const DIVISIONS = ['events', 'confectioneries', 'designs'];
const DIV_LABELS = { events: 'Luxe Events', confectioneries: 'Luxe Confectioneries', designs: 'Luxe Designs' };
const BLANK = { title: '', description: '', division: 'events', active: true, sort_order: 0 };

export default function Services() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeDivision, setActiveDivision] = useState('events');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getServices();
      setItems(res.data || []);
    } catch {
      toast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  async function save(form) {
    try {
      if (form.id) {
        await adminApi.updateService(form.id, form);
        toast('Service updated');
      } else {
        await adminApi.createService(form);
        toast('Service added');
      }
      setModal(null);
      load();
    } catch {
      toast('Save failed', 'error');
    }
  }

  async function del(id) {
    if (!confirm('Delete this service?')) return;
    try {
      await adminApi.deleteService(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  }

  const divided = DIVISIONS.reduce((acc, d) => {
    acc[d] = items.filter(s => s.division === d);
    return acc;
  }, {});

  const visible = divided[activeDivision] || [];

  return (
    <div>
      <PageHeader title="Services" count={items.length}>
        <button onClick={() => setModal({ ...BLANK, division: activeDivision })} style={btnGold}>+ Add Service</button>
      </PageHeader>

      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '2px solid #e8e5df' }}>
        {DIVISIONS.map(d => (
          <button
            key={d}
            onClick={() => setActiveDivision(d)}
            style={{
              padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600,
              color: activeDivision === d ? '#0B2B22' : '#9ca3af',
              borderBottom: activeDivision === d ? '2px solid #0B2B22' : '2px solid transparent',
              marginBottom: -2,
              transition: 'color 0.15s',
            }}
          >
            {DIV_LABELS[d]} ({divided[d].length})
          </button>
        ))}
      </div>

      {loading ? <LoadingRows n={4} /> : visible.length === 0 ? (
        <EmptyState
          message={`No services for ${DIV_LABELS[activeDivision]} yet.`}
          onAction={() => setModal({ ...BLANK, division: activeDivision })}
          actionLabel="Add First Service"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map(item => (
            <Card key={item.id} style={{ padding: '14px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#111827', fontFamily: 'Inter, sans-serif' }}>{item.title}</span>
                  {!item.active && <Badge label="Hidden" bg="#f3f4f6" color="#6b7280" />}
                </div>
                {item.description && (
                  <p style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setModal(item)} style={btnEdit}>Edit</button>
                <button onClick={() => del(item.id)} style={btnDanger}>Del</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <ServiceModal initial={modal} onSave={save} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function ServiceModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    id:          initial.id,
    division:    initial.division || 'events',
    title:       initial.title || '',
    description: initial.description || '',
    sort_order:  initial.sort_order || 0,
    active:      initial.active !== undefined ? initial.active : true,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={form.id ? 'Edit Service' : 'Add Service'} onClose={onClose}>
      <FormField label="Division">
        <select value={form.division} onChange={e => set('division', e.target.value)} style={{ ...selectStyle, width: '100%' }}>
          {DIVISIONS.map(d => <option key={d} value={d}>{DIV_LABELS[d]}</option>)}
        </select>
      </FormField>
      <FormField label="Service Title *">
        <input value={form.title} onChange={e => set('title', e.target.value)} style={inputStyle} placeholder="e.g. Wedding & Reception Planning" />
      </FormField>
      <FormField label="Description">
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          placeholder="Brief description of this service…"
        />
      </FormField>
      <FormField label="Sort Order">
        <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} style={{ ...inputStyle, width: 100 }} min={0} />
      </FormField>
      <FormField label="Visibility">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151' }}>
          <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} />
          Visible on website
        </label>
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={btnGhost}>Cancel</button>
        <button onClick={() => { if (!form.title) return; onSave(form); }} style={btnPrimary}>
          {form.id ? 'Update' : 'Add'}
        </button>
      </div>
    </Modal>
  );
}

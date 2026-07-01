import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';
const DIVS = ['events', 'confectioneries', 'designs'];
const DIV_LABEL = { events: 'Luxe Events', confectioneries: 'Luxe Confectioneries', designs: 'Luxe Designs' };
const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' };
const btn = (bg, color, extra = {}) => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', ...extra });

export default function Services() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState('events');
  const [editing, setEditing] = useState(null); // item being edited
  const [adding, setAdding]   = useState(false);
  const [newTitle, setNewTitle] = useState('');

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getServices(); setItems(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load services'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function saveEdit(item) {
    try { await adminApi.updateService(item.id, { title: item.title, description: item.description, active: item.active }); setEditing(null); load(); }
    catch (e) { alert(e.message); }
  }

  async function addService() {
    if (!newTitle.trim()) return;
    try { await adminApi.createService({ division: tab, title: newTitle.trim(), sort_order: items.filter(x => x.division === tab).length, active: true }); setNewTitle(''); setAdding(false); load(); }
    catch (e) { alert(e.message); }
  }

  async function del(id) {
    if (!confirm('Delete this service?')) return;
    try { await adminApi.deleteService(id); load(); }
    catch (e) { alert(e.message); }
  }

  const visible = items.filter(x => x.division === tab);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>Services</h1>
        <button onClick={() => { setAdding(true); setNewTitle(''); }} style={btn(GOLD, G)}>+ Add Service</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e8e5df', marginBottom: 24 }}>
        {DIVS.map(d => (
          <button key={d} onClick={() => setTab(d)} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: tab === d ? G : '#9ca3af', borderBottom: tab === d ? `2px solid ${G}` : '2px solid transparent', marginBottom: -2, transition: 'color 0.15s' }}>
            {DIV_LABEL[d]} ({items.filter(x => x.division === d).length})
          </button>
        ))}
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 52, background: '#e8e5df', borderRadius: 6, opacity: 0.6 }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.length === 0 && !adding && (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
              <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>No services for {DIV_LABEL[tab]} yet.</p>
            </div>
          )}

          {visible.map(item => (
            <div key={item.id} style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: '14px 18px' }}>
              {editing?.id === item.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input value={editing.title} onChange={e => setEditing(x => ({ ...x, title: e.target.value }))} style={inp} placeholder="Service title" />
                  <textarea value={editing.description || ''} onChange={e => setEditing(x => ({ ...x, description: e.target.value }))} rows={2} style={{ ...inp, resize: 'vertical' }} placeholder="Description (optional)" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editing.active} onChange={e => setEditing(x => ({ ...x, active: e.target.checked })) } /> Active
                    </label>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditing(null)} style={btn('#f3f4f6', '#374151')}>Cancel</button>
                      <button onClick={() => saveEdit(editing)} style={btn(G, '#fff')}>Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: item.active ? '#111827' : '#9ca3af', margin: 0, fontFamily: 'Inter, sans-serif' }}>{item.title}</p>
                    {item.description && <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0', fontFamily: 'Inter, sans-serif' }}>{item.description}</p>}
                  </div>
                  {!item.active && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#f3f4f6', color: '#9ca3af', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Hidden</span>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditing({ ...item })} style={btn(G, '#fff', { fontSize: 11 })}>Edit</button>
                    <button onClick={() => del(item.id)} style={btn('#fee2e2', '#991b1b', { fontSize: 11 })}>Del</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {adding && (
            <div style={{ background: '#fff', border: `2px solid ${GOLD}`, borderRadius: 8, padding: '14px 18px', display: 'flex', gap: 10 }}>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addService()} style={{ ...inp }} placeholder={`New ${DIV_LABEL[tab]} service title…`} autoFocus />
              <button onClick={addService} style={btn(G, '#fff')}>Add</button>
              <button onClick={() => setAdding(false)} style={btn('#f3f4f6', '#374151')}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

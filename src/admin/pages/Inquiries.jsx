import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521', CREAM = '#F7F3E8';

const STATUS_META = {
  new:       { label: 'New',       bg: '#dbeafe', color: '#1d4ed8' },
  read:      { label: 'Read',      bg: '#fef3c7', color: '#92400e' },
  contacted: { label: 'Contacted', bg: '#d1fae5', color: '#065f46' },
  closed:    { label: 'Closed',    bg: '#f3f4f6', color: '#6b7280' },
};

function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.new;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, background: m.bg, color: m.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {m.label}
    </span>
  );
}

export default function Inquiries() {
  const [rows, setRows]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(1);
  const [statusF, setStatusF] = useState('');
  const [serviceF, setServiceF] = useState('');
  const [selected, setSelected] = useState(null);
  const limit = 20;

  async function load() {
    setLoading(true); setError('');
    try {
      const res = await adminApi.getInquiries({ status: statusF, service: serviceF, page, limit });
      setRows(res.data || []);
      setTotal(res.total || 0);
    } catch (e) {
      setError(e.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusF, serviceF, page]); // eslint-disable-line

  async function markStatus(id, status) {
    try { await adminApi.updateInquiry(id, { status }); load(); }
    catch (e) { alert(e.message); }
  }

  async function saveNotes(id, notes) {
    try { await adminApi.updateInquiry(id, { notes }); load(); setSelected(s => ({ ...s, notes })); }
    catch (e) { alert(e.message); }
  }

  async function del(id) {
    if (!confirm('Delete this inquiry?')) return;
    try { await adminApi.deleteInquiry(id); setSelected(null); load(); }
    catch (e) { alert(e.message); }
  }

  const pages = Math.ceil(total / limit) || 1;

  const sel = { padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#fff' };
  const btn = (bg, color) => ({ padding: '7px 14px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: 0 }}>
          Inquiries <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 18 }}>({total})</span>
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={statusF} onChange={e => { setStatusF(e.target.value); setPage(1); }} style={sel}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={serviceF} onChange={e => { setServiceF(e.target.value); setPage(1); }} style={sel}>
          <option value="">All Divisions</option>
          <option value="events">Events</option>
          <option value="confectioneries">Confectioneries</option>
          <option value="designs">Designs</option>
        </select>
        {(statusF || serviceF) && (
          <button onClick={() => { setStatusF(''); setServiceF(''); setPage(1); }} style={btn('#f3f4f6', '#374151')}>Clear</button>
        )}
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 52, background: '#e8e5df', borderRadius: 6, opacity: 0.6 }} />)}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>No inquiries found.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e5df', background: '#fafaf9' }}>
                  {['Date', 'Name', 'Email', 'Phone', 'Division', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 14px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>{r.name}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.email}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{r.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', textTransform: 'capitalize', color: '#374151' }}>{r.service}</td>
                    <td style={{ padding: '12px 14px' }}><Badge status={r.status} /></td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelected(r)} style={btn(G, '#fff')}>View</button>
                        <button onClick={() => del(r.id)} style={btn('#fee2e2', '#991b1b')}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: '1px solid #e8e5df' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={btn('#f3f4f6', '#374151')}>← Prev</button>
              <span style={{ fontSize: 13, color: '#6b7280' }}>Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} style={btn('#f3f4f6', '#374151')}>Next →</button>
            </div>
          )}
        </div>
      )}

      {selected && (
        <InquiryDetail
          inquiry={selected}
          onClose={() => setSelected(null)}
          onStatus={markStatus}
          onNotes={saveNotes}
          onDelete={del}
        />
      )}
    </div>
  );
}

function InquiryDetail({ inquiry, onClose, onStatus, onNotes, onDelete }) {
  const [notes, setNotes] = useState(inquiry.notes || '');
  const btn = (bg, color) => ({ padding: '8px 16px', background: bg, color, border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e5df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, margin: 0, color: '#111827' }}>{inquiry.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 24, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 20 }}>
            {[['Email', inquiry.email], ['Phone', inquiry.phone || '—'], ['Division', inquiry.service], ['Date', new Date(inquiry.created_at).toLocaleString('en-GB')]].map(([l, v]) => (
              <div key={l}>
                <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px', fontFamily: 'Inter, sans-serif' }}>{l}</p>
                <p style={{ fontSize: 14, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{v}</p>
              </div>
            ))}
          </div>
          {inquiry.message && (
            <div style={{ background: '#f9fafb', border: '1px solid #e8e5df', borderRadius: 6, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', fontFamily: 'Inter, sans-serif' }}>Message</p>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>{inquiry.message}</p>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Status</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(STATUS_META).map(([k, v]) => (
                <button key={k} onClick={() => onStatus(inquiry.id, k)}
                  style={{ ...btn(inquiry.status === k ? G : '#f3f4f6', inquiry.status === k ? '#fff' : '#374151'), padding: '6px 14px', fontSize: 12 }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>Internal Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }}
              placeholder="Add notes…" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => onDelete(inquiry.id)} style={btn('#fee2e2', '#991b1b')}>Delete</button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={btn('#f3f4f6', '#374151')}>Close</button>
              <button onClick={() => onNotes(inquiry.id, notes)} style={btn(G, '#fff')}>Save Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

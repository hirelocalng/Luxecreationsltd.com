import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Modal, FormField,
  Badge, Card, btnPrimary, btnDanger, btnGhost, selectStyle, inputStyle,
} from '../components/ui';

// Backend status values: new | read | contacted | closed
const STATUS_COLORS = {
  new:       { label: 'New',       bg: '#dbeafe', color: '#1d4ed8' },
  read:      { label: 'Read',      bg: '#fef3c7', color: '#92400e' },
  contacted: { label: 'Contacted', bg: '#d1fae5', color: '#065f46' },
  closed:    { label: 'Closed',    bg: '#f3f4f6', color: '#6b7280' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.new;
  return <Badge label={s.label} bg={s.bg} color={s.color} />;
}

export default function Inquiries() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', service: '' });
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getInquiries({ ...filters, page, limit: 25 });
      setItems(res.data || []);
      setTotal(res.total || 0);
    } catch {
      toast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, page, toast]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    try {
      await adminApi.updateInquiry(id, { status });
      toast('Status updated');
      load();
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch {
      toast('Update failed', 'error');
    }
  }

  async function saveNotes(id, notes) {
    try {
      await adminApi.updateInquiry(id, { notes });
      toast('Notes saved');
      load();
    } catch {
      toast('Failed to save notes', 'error');
    }
  }

  async function del(id) {
    if (!confirm('Delete this inquiry permanently?')) return;
    try {
      await adminApi.deleteInquiry(id);
      toast('Inquiry deleted');
      setSelected(null);
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  }

  return (
    <div>
      <PageHeader title="Inquiries" count={total} />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <select
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
          style={selectStyle}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filters.service}
          onChange={e => { setFilters(f => ({ ...f, service: e.target.value })); setPage(1); }}
          style={selectStyle}
        >
          <option value="">All Divisions</option>
          <option value="events">Events</option>
          <option value="confectioneries">Confectioneries</option>
          <option value="designs">Designs</option>
        </select>
        {(filters.status || filters.service) && (
          <button onClick={() => { setFilters({ status: '', service: '' }); setPage(1); }} style={btnGhost}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? <LoadingRows n={6} /> : items.length === 0 ? (
        <EmptyState message="No inquiries found." />
      ) : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e5df' }}>
                  {['Date', 'Name', 'Email', 'Division', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(row => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onClick={() => setSelected(row)}
                  >
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: '#6b7280' }}>
                      {new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>{row.name}</td>
                    <td style={{ padding: '12px 14px', color: '#374151' }}>{row.email}</td>
                    <td style={{ padding: '12px 14px', textTransform: 'capitalize', color: '#374151' }}>{row.service}</td>
                    <td style={{ padding: '12px 14px' }}><StatusBadge status={row.status} /></td>
                    <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => del(row.id)} style={{ padding: '6px 12px', border: 'none', borderRadius: 4, background: '#fee2e2', color: '#991b1b', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 25 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: '1px solid #e8e5df' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={btnGhost}>← Prev</button>
              <span style={{ fontSize: 13, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Page {page} of {Math.ceil(total / 25)}
              </span>
              <button disabled={page >= Math.ceil(total / 25)} onClick={() => setPage(p => p + 1)} style={btnGhost}>Next →</button>
            </div>
          )}
        </Card>
      )}

      {selected && (
        <InquiryModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          onSaveNotes={saveNotes}
          onDelete={del}
        />
      )}
    </div>
  );
}

function InquiryModal({ inquiry, onClose, onStatusChange, onSaveNotes, onDelete }) {
  const [notes, setNotes] = useState(inquiry.notes || '');

  return (
    <Modal title={`Inquiry — ${inquiry.name}`} onClose={onClose} width={600}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 20 }}>
        {[
          ['Name', inquiry.name],
          ['Email', inquiry.email],
          ['Phone', inquiry.phone || '—'],
          ['Division', inquiry.service],
          ['Preferred Date', inquiry.preferred_date ? new Date(inquiry.preferred_date).toLocaleDateString('en-GB') : '—'],
          ['Submitted', new Date(inquiry.created_at).toLocaleString('en-GB')],
        ].map(([label, value]) => (
          <div key={label}>
            <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>{label}</p>
            <p style={{ fontSize: 14, color: '#111827', fontFamily: 'Inter, sans-serif', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {inquiry.message && (
        <div style={{ background: '#f9fafb', border: '1px solid #e8e5df', borderRadius: 6, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Message</p>
          <p style={{ fontSize: 14, color: '#374151', fontFamily: 'Inter, sans-serif', margin: 0, lineHeight: 1.6 }}>{inquiry.message}</p>
        </div>
      )}

      <FormField label="Status">
        <select
          value={inquiry.status}
          onChange={e => onStatusChange(inquiry.id, e.target.value)}
          style={{ ...selectStyle, width: '100%' }}
        >
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Internal Notes">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          placeholder="Add internal notes…"
        />
      </FormField>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        <button onClick={() => onDelete(inquiry.id)} style={{ padding: '6px 12px', border: 'none', borderRadius: 4, background: '#fee2e2', color: '#991b1b', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontWeight: 600 }}>Delete Inquiry</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button onClick={() => onSaveNotes(inquiry.id, notes)} style={btnPrimary}>Save Notes</button>
        </div>
      </div>
    </Modal>
  );
}

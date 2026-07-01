import { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';

const G = '#0B2B22', GOLD = '#D9A521';

export default function Newsletter() {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [filter, setFilter]   = useState('active');

  async function load() {
    setLoading(true); setError('');
    try { const r = await adminApi.getSubscribers(filter || undefined); setSubs(r.data || []); }
    catch (e) { setError(e.message || 'Failed to load subscribers'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  function exportCsv() {
    const header = 'Email,Name,Status,Subscribed\n';
    const rows = subs.map(s => `${s.email},${s.name || ''},${s.status},${s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString('en-GB') : ''}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `subscribers-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const active = subs.filter(s => s.status === 'active').length;
  const sel = { padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', background: '#fff' };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>Newsletter</h1>
          <p style={{ fontSize: 13, color: '#059669', fontFamily: 'Inter, sans-serif', margin: 0, fontWeight: 600 }}>{active} active subscriber{active !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCsv} disabled={subs.length === 0} style={{ padding: '9px 20px', background: GOLD, color: G, border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', opacity: subs.length === 0 ? 0.5 : 1 }}>
          Export CSV
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={sel}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <div key={i} style={{ height: 48, background: '#e8e5df', borderRadius: 6, opacity: 0.6 }} />)}
        </div>
      ) : subs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 8 }}>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>No subscribers match this filter.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e5df', background: '#fafaf9' }}>
                {['Email', 'Name', 'Status', 'Subscribed'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{s.email}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>{s.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: s.status === 'active' ? '#d1fae5' : '#f3f4f6', color: s.status === 'active' ? '#065f46' : '#6b7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                    {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

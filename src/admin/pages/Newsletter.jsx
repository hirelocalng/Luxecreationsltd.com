import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import {
  PageHeader, LoadingRows, EmptyState, Card, Badge, selectStyle,
} from '../components/ui';

// Backend columns: email, name, status, subscribed_at

export default function Newsletter() {
  const { toast } = useToast();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSubscribers(filter || undefined);
      setSubs(res.data || []);
    } catch {
      toast('Failed to load subscribers', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => { load(); }, [load]);

  const active = subs.filter(s => s.status === 'active').length;

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" count={subs.length}>
        <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#059669', fontWeight: 600 }}>
          {active} active
        </span>
      </PageHeader>

      <div style={{ marginBottom: 20 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>

      {loading ? <LoadingRows n={6} /> : subs.length === 0 ? (
        <EmptyState message="No subscribers match this filter." />
      ) : (
        <Card>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e5df' }}>
                {['Email', 'Name', 'Status', 'Subscribed'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#6b7280', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>{sub.email}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{sub.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {sub.status === 'active'
                      ? <Badge label="Active" bg="#d1fae5" color="#065f46" />
                      : <Badge label="Unsubscribed" bg="#f3f4f6" color="#6b7280" />}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {sub.subscribed_at
                      ? new Date(sub.subscribed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

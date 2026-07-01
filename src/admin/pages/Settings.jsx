import { useState } from 'react';
import { adminApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const G = '#0B2B22';
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db', borderRadius: 4, fontSize: 13, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', outline: 'none' };
const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 5 };

export default function Settings() {
  const { admin } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.currentPassword || !form.newPassword) return setError('All fields are required');
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match');
    if (form.newPassword.length < 8) return setError('New password must be at least 8 characters');
    setSaving(true);
    try {
      await adminApi.changePassword({ current_password: form.currentPassword, new_password: form.newPassword });
      setSuccess('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setError(e.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: '0 0 24px' }}>Settings</h1>

      {/* Account info */}
      <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: '18px 24px', marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>Logged in as</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0, fontFamily: 'Inter, sans-serif' }}>{admin?.email || '—'}</p>
      </div>

      {/* Change password */}
      <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 8, padding: '24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 20px' }}>Change Password</h2>

        {success && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{success}</div>}
        {error   && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{error}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lbl}>Current Password</label>
            <input type="password" value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)} style={inp} autoComplete="current-password" placeholder="••••••••" />
          </div>
          <div>
            <label style={lbl}>New Password <span style={{ fontWeight: 400, color: '#9ca3af' }}>(min 8 characters)</span></label>
            <input type="password" value={form.newPassword} onChange={e => set('newPassword', e.target.value)} style={inp} autoComplete="new-password" placeholder="••••••••" />
          </div>
          <div>
            <label style={lbl}>Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
              style={{ ...inp, borderColor: form.confirmPassword && form.confirmPassword !== form.newPassword ? '#ef4444' : undefined }}
              autoComplete="new-password" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={saving} style={{ padding: '10px 20px', background: G, color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

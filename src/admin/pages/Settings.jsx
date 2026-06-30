import { useState } from 'react';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { FormField, Card, btnPrimary, inputStyle } from '../components/ui';

export default function Settings() {
  const { toast } = useToast();
  const { admin } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword) {
      toast('All fields are required', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast('New passwords do not match', 'error');
      return;
    }
    if (form.newPassword.length < 8) {
      toast('New password must be at least 8 characters', 'error');
      return;
    }
    setSaving(true);
    try {
      await adminApi.changePassword({
        current_password: form.currentPassword,
        new_password: form.newPassword,
      });
      toast('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast(err.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: '0 0 24px' }}>
        Account Settings
      </h1>

      <Card style={{ padding: 28, marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>
          Logged in as
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#111827', fontWeight: 600, margin: 0 }}>
          {admin?.email || '—'}
        </p>
      </Card>

      <Card style={{ padding: 28 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 20px' }}>
          Change Password
        </h2>
        <form onSubmit={submit}>
          <FormField label="Current Password *">
            <input
              type="password"
              value={form.currentPassword}
              onChange={e => set('currentPassword', e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </FormField>
          <FormField label="New Password *" hint="Minimum 8 characters">
            <input
              type="password"
              value={form.newPassword}
              onChange={e => set('newPassword', e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </FormField>
          <FormField label="Confirm New Password *">
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => set('confirmPassword', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: form.confirmPassword && form.confirmPassword !== form.newPassword ? '#ef4444' : undefined,
              }}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </FormField>
          <button type="submit" disabled={saving} style={btnPrimary}>
            {saving ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </Card>
    </div>
  );
}

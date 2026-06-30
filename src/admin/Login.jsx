import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { adminApi } from './lib/api';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, admin } = await adminApi.login(form);
      login(token, admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed — check your credentials');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B2B22',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/assets/logo.png" alt="Luxe Creations" style={{ height: 68, marginBottom: 14 }} />
          <p style={{ color: 'rgba(247,243,232,0.45)', fontSize: 11, letterSpacing: '0.18em', margin: 0, textTransform: 'uppercase' }}>
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 8, padding: '32px 28px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, color: '#0B2B22', margin: '0 0 22px' }}>
            Sign In
          </h1>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, padding: '10px 14px', marginBottom: 18, color: '#991b1b', fontSize: 13 }}>
              {error}
            </div>
          )}

          <Label>Email</Label>
          <input
            type="email" required autoComplete="email"
            value={form.email} onChange={set('email')}
            style={inp} placeholder="admin@example.com"
          />

          <Label style={{ marginTop: 14 }}>Password</Label>
          <input
            type="password" required autoComplete="current-password"
            value={form.password} onChange={set('password')}
            style={inp} placeholder="••••••••"
          />

          <button
            type="submit" disabled={loading}
            style={{ ...btnPrimary, width: '100%', marginTop: 24, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Label({ children, style }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.03em', ...style }}>
      {children}
    </label>
  );
}

const inp = {
  width: '100%', padding: '10px 12px', border: '1.5px solid #d1d5db',
  borderRadius: 4, fontSize: 14, fontFamily: 'Inter, sans-serif',
  color: '#111827', outline: 'none', boxSizing: 'border-box',
};
const btnPrimary = {
  padding: '11px 20px', background: '#0B2B22', color: '#fff', border: 'none',
  borderRadius: 4, fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};

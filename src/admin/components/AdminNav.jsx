import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',    icon: '⬡' },
  { to: '/admin/inquiries',    label: 'Inquiries',    icon: '✉' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '★' },
  { to: '/admin/portfolio',    label: 'Portfolio',    icon: '⊞' },
  { to: '/admin/blog',         label: 'Blog',         icon: '✎' },
  { to: '/admin/services',     label: 'Services',     icon: '◉' },
  { to: '/admin/seo',          label: 'SEO',          icon: '⊛' },
  { to: '/admin/newsletter',   label: 'Newsletter',   icon: '◎' },
  { to: '/admin/settings',     label: 'Settings',     icon: '⚙' },
];

const FOREST = '#0B2B22';
const GOLD = '#D9A521';
const DIM = 'rgba(247,243,232,0.6)';
const ACTIVE_BG = 'rgba(217,165,33,0.1)';

export default function AdminNav({ collapsed }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: collapsed ? 56 : 220,
      minHeight: '100vh',
      background: FOREST,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'width 0.22s ease',
      overflow: 'hidden',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/assets/logo.png"
            alt="Luxe Creations"
            style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0 }}
          />
          {!collapsed && (
            <div>
              <p style={{ color: GOLD, fontFamily: 'Georgia, serif', fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                Luxe Creations
              </p>
              <p style={{ color: DIM, fontFamily: 'Inter, sans-serif', fontSize: 9, margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Admin Panel
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 0', overflow: 'hidden auto' }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 16px' : '10px 18px',
              color: isActive ? GOLD : DIM,
              background: isActive ? ACTIVE_BG : 'transparent',
              borderLeft: isActive ? `2px solid ${GOLD}` : '2px solid transparent',
              textDecoration: 'none',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              fontWeight: isActive ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
            })}
          >
            <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0, opacity: 0.9 }}>{icon}</span>
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {!collapsed && admin && (
          <p style={{
            color: DIM, fontSize: 11, fontFamily: 'Inter, sans-serif', margin: '0 0 10px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {admin.email}
          </p>
        )}
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          title="Sign out"
          style={{
            width: '100%', padding: '7px 8px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: DIM,
            cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8,
          }}
        >
          <span style={{ fontSize: 14 }}>↩</span>
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './components/AdminNav';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <AdminNav collapsed={collapsed} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f4f1', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 52,
          background: '#fff',
          borderBottom: '1px solid #e8e5df',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 14,
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            aria-label="Toggle sidebar"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 19, padding: 4, lineHeight: 1 }}
          >
            ☰
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 12, textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}
          >
            View Site ↗
          </a>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 28px 40px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './components/AdminNav';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(o => !o);
    else setCollapsed(c => !c);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          role="presentation"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar wrapper */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: isMobile ? (mobileOpen ? 0 : -260) : 0,
        height: isMobile ? '100%' : undefined,
        zIndex: isMobile ? 50 : 1,
        transition: 'left 0.25s ease',
        flexShrink: 0,
      }}>
        <AdminNav
          collapsed={!isMobile && collapsed}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f4f1', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 52,
          background: '#fff',
          borderBottom: '1px solid #e8e5df',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 14,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: 19,
              padding: 4,
              lineHeight: 1,
              flexShrink: 0,
            }}
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
        <main style={{ flex: 1, padding: 'clamp(16px, 3vw, 28px)', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Shared admin UI primitives

export const h1Style = {
  fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111827', margin: '0 0 4px',
};
export const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db', borderRadius: 4,
  fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#111827', boxSizing: 'border-box', outline: 'none',
};
export const selectStyle = {
  padding: '8px 12px', border: '1.5px solid #d1d5db', borderRadius: 4,
  fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#374151', background: '#fff', cursor: 'pointer',
};
export const btnPrimary = {
  padding: '9px 20px', background: '#0B2B22', color: '#fff', border: 'none',
  borderRadius: 4, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};
export const btnGold = {
  padding: '9px 20px', background: '#D9A521', color: '#0B2B22', border: 'none',
  borderRadius: 4, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};
export const btnGhost = {
  padding: '8px 16px', border: '1.5px solid #d1d5db', borderRadius: 4,
  background: '#fff', color: '#374151', fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};
export const btnDanger = {
  padding: '6px 12px', border: 'none', borderRadius: 4,
  background: '#fee2e2', color: '#991b1b', fontSize: 12,
  fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontWeight: 600,
};
export const btnEdit = {
  padding: '6px 12px', border: '1.5px solid #d1d5db', borderRadius: 4,
  background: '#fff', color: '#374151', fontSize: 12, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
};
export const arrowBtn = {
  width: 26, height: 26, padding: 0, border: '1.5px solid #e5e7eb', borderRadius: 4,
  background: '#fff', color: '#6b7280', fontSize: 10, cursor: 'pointer', lineHeight: 1,
};

export function PageHeader({ title, count, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <h1 style={h1Style}>
        {title}
        {count != null && (
          <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: 18, marginLeft: 8 }}>({count})</span>
        )}
      </h1>
      <div style={{ display: 'flex', gap: 10 }}>{children}</div>
    </div>
  );
}

export function LoadingRows({ n = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ height: 56, background: '#e8e5df', borderRadius: 6, animation: 'pulse 1.4s ease infinite', animationDelay: `${i * 0.08}s` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.45} 50%{opacity:.85} }`}</style>
    </div>
  );
}

export function EmptyState({ message, onAction, actionLabel }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px', background: '#fff', border: '1px solid #e8e5df', borderRadius: 6 }}>
      <p style={{ color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontSize: 15, margin: '0 0 20px' }}>{message}</p>
      {onAction && (
        <button onClick={onAction} style={btnGold}>{actionLabel}</button>
      )}
    </div>
  );
}

export function Modal({ onClose, title, children, width = 500 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e5df', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 22, lineHeight: 1, padding: 0 }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: 6, letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>{hint}</p>}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e5df', borderRadius: 6, ...style }}>
      {children}
    </div>
  );
}

export function Badge({ label, color = '#374151', bg = '#f3f4f6' }) {
  return (
    <span style={{
      padding: '3px 9px', borderRadius: 20, background: bg, color,
      fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

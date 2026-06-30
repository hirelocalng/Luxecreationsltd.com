import { createContext, useContext, useState, useCallback } from 'react';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 18px',
            borderRadius: 6,
            background: t.type === 'error' ? '#7f1d1d' : '#0B2B22',
            color: '#fff',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            borderLeft: `3px solid ${t.type === 'error' ? '#ef4444' : '#D9A521'}`,
            maxWidth: 340,
            animation: 'toastIn 0.2s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

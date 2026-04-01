import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Notification() {
  const { notification, dispatch } = useApp();

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div
      className="animate-fadeInDown"
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: '12px 20px',
        background: isError ? 'var(--color-expense)' : 'var(--color-income)',
        color: '#fff',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        fontSize: 'var(--font-sm)',
        fontWeight: 500,
        animation: 'fadeInDown 0.3s ease, fadeIn 0.3s ease',
      }}
    >
      {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
      <span>{notification.message}</span>
      <button
        onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })}
        style={{ background: 'none', color: '#fff', padding: 2, display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

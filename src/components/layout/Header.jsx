import { Search, Menu, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getGreeting } from '../../utils/formatters';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export default function Header() {
  const { currentPage, filters, setFilter, toggleSidebar, role } = useApp();

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button className="mobile-menu-btn btn-icon btn-ghost" onClick={toggleSidebar} id="mobile-menu-btn">
          <Menu size={22} />
        </button>
        <div className="header-left">
          <h1>{PAGE_TITLES[currentPage]}</h1>
          <p>{getGreeting()}! Here&apos;s your financial overview.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            id="global-search"
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: role === 'admin' ? 'var(--color-savings-light)' : 'var(--color-balance-light)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            color: role === 'admin' ? 'var(--color-savings)' : 'var(--color-balance)',
          }}
        >
          {role === 'admin' ? '🛡️ Admin' : '👁️ Viewer'}
        </div>
      </div>
    </header>
  );
}

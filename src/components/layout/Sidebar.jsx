import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Sun,
  Moon,
  TrendingUp,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { currentPage, setPage, role, setRole, theme, toggleTheme, sidebarOpen, toggleSidebar } = useApp();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <TrendingUp size={20} />
          </div>
          <span>FinSight</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Menu</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setPage(item.id)}
                id={`nav-${item.id}`}
              >
                <Icon className="nav-icon" size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="role-switcher">
          <div className="role-switcher-label">Role</div>
          <div className="role-options">
            <button
              className={`role-option ${role === 'viewer' ? 'active' : ''}`}
              onClick={() => setRole('viewer')}
              id="role-viewer"
            >
              👁️ Viewer
            </button>
            <button
              className={`role-option ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
              id="role-admin"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="sidebar-footer">
          <div className="theme-toggle" onClick={toggleTheme} id="theme-toggle">
            <div className="theme-toggle-label">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

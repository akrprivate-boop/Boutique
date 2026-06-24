import { useAuth } from '../../hooks/useAuth';
import config from '../../config/config';
import { LogOut } from 'lucide-react';
import '../../styles/layout.css';

export default function Header() {
  const { logout } = useAuth();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-logo">{config.boutiqueName}</h1>
        <div className="header-divider" />
        <span className="header-tagline">{config.tagline}</span>
      </div>

      <div className="header-actions">
        <span className="header-date">{today}</span>
        <button
          className="logout-btn"
          onClick={logout}
          id="logout-btn"
          title="Sign out"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

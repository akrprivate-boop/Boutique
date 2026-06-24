import { LayoutDashboard, UserPlus, CalendarDays, Database } from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'entry', label: 'Customer Entry', icon: UserPlus },
  { id: 'calendar', label: 'Delivery Calendar', icon: CalendarDays },
  { id: 'database', label: 'Customer Database', icon: Database },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <nav className="tab-nav" role="tablist" aria-label="Main navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            id={`tab-${tab.id}`}
          >
            <Icon className="tab-icon" size={18} />
            <span className="tab-label-text">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

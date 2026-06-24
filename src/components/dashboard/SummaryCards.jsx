import { Users, Truck, CalendarCheck, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      id: 'total-orders',
      label: 'Total Orders',
      value: summary.totalOrders,
      color: 'rose',
      icon: Users,
    },
    {
      id: 'pending-deliveries',
      label: 'Pending Deliveries',
      value: summary.pendingDeliveries,
      color: 'gold',
      icon: Truck,
    },
    {
      id: 'today-deliveries',
      label: "Today's Deliveries",
      value: summary.todaysDeliveries,
      color: 'green',
      icon: CalendarCheck,
    },
    {
      id: 'pending-amount',
      label: 'Pending Payments',
      value: formatCurrency(summary.totalPendingAmount),
      color: 'blue',
      icon: IndianRupee,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`summary-card ${card.color}`}
            id={card.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="summary-card-header">
              <span className="summary-card-label">{card.label}</span>
              <div className="summary-card-icon">
                <Icon size={22} />
              </div>
            </div>
            <div className="summary-card-value">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}

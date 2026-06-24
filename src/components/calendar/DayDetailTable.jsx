import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { orderService } from '../../services/orderService';
import { formatDateISO, formatDateDMY, formatCurrency, calcPending } from '../../utils/formatters';
import { CheckCircle, Clock } from 'lucide-react';
import Loader from '../common/Loader';

export default function DayDetailTable({ selectedDate, onStatusChange }) {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadDeliveries() {
      setIsLoading(true);
      try {
        const dateStr = formatDateISO(selectedDate);
        const data = await orderService.getDeliveriesForDate(dateStr);
        setDeliveries(data);
      } catch (error) {
        console.error("Error loading day deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadDeliveries();
  }, [selectedDate]);

  const handleMarkDelivered = async (orderId) => {
    if (!window.confirm("Mark this item as delivered?")) return;
    
    try {
      await orderService.markAsDelivered(orderId);
      setDeliveries(prev => prev.filter(d => d.id !== orderId));
      if (onStatusChange) onStatusChange();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <Loader text="Loading deliveries..." />;

  return (
    <div className="day-detail-wrapper">
      <div className="day-detail-header">
        <h3 className="day-detail-title">
          Deliveries for {format(selectedDate, 'do MMMM yyyy')}
        </h3>
        {deliveries.length > 0 && (
          <span className="day-detail-badge">{deliveries.length} Pending</span>
        )}
      </div>

      {deliveries.length === 0 ? (
        <div className="day-detail-empty">
          <Clock size={40} style={{ opacity: 0.1, marginBottom: 12 }} />
          <p>No pending deliveries scheduled for this date.</p>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <div className="data-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Entry Date</th>
                  <th>Customer Name</th>
                  <th>Product Description</th>
                  <th>Total Amount</th>
                  <th>Advance</th>
                  <th>Pending</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map(delivery => (
                  <tr key={delivery.id}>
                    <td>{formatDateDMY(delivery.entry_date)}</td>
                    <td style={{ fontWeight: 600 }}>{delivery.customer?.name}</td>
                    <td style={{ maxWidth: 200, fontSize: 'var(--fs-xs)' }}>
                      {delivery.description}
                    </td>
                    <td className="amount-cell">{formatCurrency(delivery.full_amount)}</td>
                    <td className="amount-cell">{formatCurrency(delivery.advance_amount)}</td>
                    <td className="amount-cell pending">
                      {formatCurrency(calcPending(delivery.full_amount, delivery.advance_amount))}
                    </td>
                    <td>
                      <button 
                        className="action-btn deliver" 
                        title="Mark as Delivered"
                        onClick={() => handleMarkDelivered(delivery.id)}
                      >
                        <CheckCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

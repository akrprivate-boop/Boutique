import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileDown, 
  Table as TableIcon, 
  Edit2, 
  CheckCircle,
  XCircle,
  Database,
  Trash2
} from 'lucide-react';
import { formatDateDMY, formatCurrency, calcPending } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import TableFilters from './TableFilters';
import '../../styles/tables.css';

export default function CustomerTable({ orders, onRefresh, isLoading, onDeleteOrder }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    entryDateFrom: '',
    entryDateTo: '',
    deliveryDateFrom: '',
    deliveryDateTo: '',
    deliveryStatus: 'all'
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = (type) => {
    if (type === 'pdf') {
      exportToPDF(orders);
    } else {
      exportToExcel(orders);
    }
  };

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <div className="table-search">
            <Search className="table-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>
          <button 
            className={`filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </button>
        </div>

        <div className="table-toolbar-right">
          <button className="export-btn" onClick={() => handleExport('excel')}>
            <FileDown size={16} />
            Excel
          </button>
          <button className="export-btn" onClick={() => handleExport('pdf')}>
            <FileDown size={16} />
            PDF
          </button>
        </div>
      </div>

      {showFilters && (
        <TableFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onApply={() => onRefresh(filters)}
          onReset={() => {
            const reset = {
              search: '',
              entryDateFrom: '',
              entryDateTo: '',
              deliveryDateFrom: '',
              deliveryDateTo: '',
              deliveryStatus: 'all'
            };
            setFilters(reset);
            onRefresh(reset);
          }}
        />
      )}

      <div className="data-table-wrapper">
        <div className="data-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Entry Date</th>
                <th>Delivery Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Amt</th>
                <th>Advance</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="table-empty">
                      <Database className="table-empty-icon" size={48} />
                      <h4 className="table-empty-title">No matching records found</h4>
                      <p className="table-empty-desc">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{order.order_number}</td>
                    <td>{formatDateDMY(order.entry_date)}</td>
                    <td>{formatDateDMY(order.delivery_date)}</td>
                    <td style={{ fontWeight: 500 }}>{order.customer?.name}</td>
                    <td>{order.customer?.phone || '—'}</td>
                    <td className="amount-cell">{formatCurrency(order.full_amount)}</td>
                    <td className="amount-cell">{formatCurrency(order.advance_amount)}</td>
                    <td className={`amount-cell ${!order.delivery_status ? 'pending' : ''}`}>
                      {formatCurrency(calcPending(order.full_amount, order.advance_amount))}
                    </td>
                    <td>
                      <span className={`status-badge ${order.delivery_status ? 'delivered' : 'pending'}`}>
                        <span className="status-dot"></span>
                        {order.delivery_status ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-icon" 
                        title="Delete Order"
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete order ${order.order_number}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-count">
          Showing {orders.length} entries
        </div>
      </div>
    </div>
  );
}

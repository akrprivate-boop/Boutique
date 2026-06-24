export default function TableFilters({ filters, onFilterChange, onApply, onReset }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label className="filter-label">Entry Date From</label>
        <input 
          type="date" 
          name="entryDateFrom" 
          className="filter-input"
          value={filters.entryDateFrom}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Entry Date To</label>
        <input 
          type="date" 
          name="entryDateTo" 
          className="filter-input"
          value={filters.entryDateTo}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Delivery Date From</label>
        <input 
          type="date" 
          name="deliveryDateFrom" 
          className="filter-input"
          value={filters.deliveryDateFrom}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Delivery Date To</label>
        <input 
          type="date" 
          name="deliveryDateTo" 
          className="filter-input"
          value={filters.deliveryDateTo}
          onChange={handleChange}
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select 
          name="deliveryStatus" 
          className="filter-input"
          value={filters.deliveryStatus}
          onChange={handleChange}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className="filter-actions">
        <button className="btn btn-primary btn-sm" onClick={onApply}>Apply</button>
        <button className="btn btn-secondary btn-sm" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

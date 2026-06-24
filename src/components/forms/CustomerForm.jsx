import { useState, useEffect, useCallback } from 'react';
import { User, Package, Calendar, Phone, IndianRupee, FileText, Search } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { orderService } from '../../services/orderService';
import { validateCustomerForm } from '../../utils/validation';
import { getTodayISO, formatCurrency, calcPending } from '../../utils/formatters';
import '../../styles/forms.css';

export default function CustomerForm({ onOrderCreated }) {
  const [formData, setFormData] = useState({
    customerType: 'new',
    entryDate: getTodayISO(),
    name: '',
    phone: '',
    description: '',
    deliveryDate: '',
    fullAmount: '',
    advanceAmount: '',
    customerId: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Existing Customer Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Search logic for existing customers who have no active orders
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.customerType === 'existing' && searchQuery.trim().length >= 2) {
        try {
          const results = await customerService.searchAvailable(searchQuery);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, formData.customerType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      name: customer.name,
      phone: customer.phone || '',
      customerId: customer.id
    }));
    setSearchQuery(customer.name);
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    const { isValid, errors: validationErrors } = validateCustomerForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCustomerId = formData.customerId;

      // 1. Create customer if new
      if (formData.customerType === 'new') {
        const newCustomer = await customerService.create({
          name: formData.name,
          phone: formData.phone
        });
        finalCustomerId = newCustomer.id;
      }

      // 2. Create order
      await orderService.create({
        customer_id: finalCustomerId,
        customer_type: formData.customerType,
        entry_date: formData.entryDate,
        description: formData.description,
        delivery_date: formData.deliveryDate,
        full_amount: parseInt(formData.fullAmount),
        advance_amount: parseInt(formData.advanceAmount || 0)
      });

      // 3. Success reset
      setSuccessMessage('Order created successfully!');
      setFormData({
        customerType: 'new',
        entryDate: getTodayISO(),
        name: '',
        phone: '',
        description: '',
        deliveryDate: '',
        fullAmount: '',
        advanceAmount: '',
        customerId: null
      });
      setSearchQuery('');
      
      if (onOrderCreated) onOrderCreated();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: error.message || 'Failed to save order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingAmount = calcPending(formData.fullAmount, formData.advanceAmount);

  return (
    <div className="form-container">
      {successMessage && (
        <div className="form-success">
          <Package size={18} />
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="form-error-banner" style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>
          {errors.submit}
        </div>
      )}

      <form className="form-card" onSubmit={handleSubmit}>
        {/* Section 1: User Details */}
        <div className="form-section">
          <h2 className="form-section-title">
            <User className="form-section-icon" size={20} />
            User Details
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Type of User <span className="required">*</span>
              </label>
              <select 
                className={`form-select ${errors.customerType ? 'error' : ''}`}
                name="customerType"
                value={formData.customerType}
                onChange={(e) => {
                  handleInputChange(e);
                  setSearchQuery('');
                  setFormData(prev => ({ ...prev, name: '', phone: '', customerId: null }));
                }}
              >
                <option value="new">New User</option>
                <option value="existing">Existing User</option>
              </select>
              {errors.customerType && <span className="form-error">{errors.customerType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Entry <span className="required">*</span>
              </label>
              <input 
                type="date" 
                className={`form-input ${errors.entryDate ? 'error' : ''}`}
                name="entryDate"
                value={formData.entryDate}
                onChange={handleInputChange}
              />
              {errors.entryDate && <span className="form-error">{errors.entryDate}</span>}
            </div>

            <div className="form-group customer-search-wrapper">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              {formData.customerType === 'existing' ? (
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFormData(prev => ({ ...prev, name: e.target.value, customerId: null }));
                    }}
                    autoComplete="off"
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className="customer-search-results">
                      {searchResults.map(customer => (
                        <div 
                          key={customer.id} 
                          className="customer-search-item"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          <div className="customer-search-item-name">{customer.name}</div>
                          <div className="customer-search-item-phone">{customer.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
                    <div className="customer-search-results">
                      <div className="customer-search-empty">No eligible customers found</div>
                    </div>
                  )}
                </div>
              ) : (
                <input 
                  type="text" 
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              )}
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Only digits allowed"
                  disabled={formData.customerType === 'existing' && formData.customerId}
                />
                <Phone size={14} style={{ position: 'absolute', right: 12, top: 14, opacity: 0.3 }} />
              </div>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Section 2: Product Details */}
        <div className="form-section">
          <h2 className="form-section-title">
            <Package className="form-section-icon" size={20} />
            Product Details
          </h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">
                Description of Product
              </label>
              <textarea 
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Details of item, fabric, measurements, etc. (Max 1000 words)"
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Date of Delivery <span className="required">*</span>
              </label>
              <input 
                type="date" 
                className={`form-input ${errors.deliveryDate ? 'error' : ''}`}
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                min={formData.entryDate}
              />
              {errors.deliveryDate && <span className="form-error">{errors.deliveryDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Full Amount <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  className={`form-input ${errors.fullAmount ? 'error' : ''}`}
                  name="fullAmount"
                  value={formData.fullAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                />
                <IndianRupee size={14} style={{ position: 'absolute', right: 12, top: 14, opacity: 0.3 }} />
              </div>
              {errors.fullAmount && <span className="form-error">{errors.fullAmount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Advance Amount Given
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  className={`form-input ${errors.advanceAmount ? 'error' : ''}`}
                  name="advanceAmount"
                  value={formData.advanceAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount if any"
                />
                <IndianRupee size={14} style={{ position: 'absolute', right: 12, top: 14, opacity: 0.3 }} />
              </div>
              {errors.advanceAmount && <span className="form-error">{errors.advanceAmount}</span>}
            </div>

            <div className="form-group full-width">
              <div className="pending-display">
                <span className="pending-label">Pending Amount:</span>
                <span className="pending-value">{formatCurrency(pendingAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', maxWidth: '200px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
}

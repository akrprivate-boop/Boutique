/**
 * Form Validation Utilities
 */

export function validateCustomerForm(values) {
  const errors = {};

  // Customer type
  if (!values.customerType) {
    errors.customerType = 'Please select customer type';
  }

  // Entry date
  if (!values.entryDate) {
    errors.entryDate = 'Date of entry is required';
  }

  // Name
  if (!values.name || values.name.trim().length === 0) {
    errors.name = 'Name is required';
  }

  // Phone (optional but must be numbers only if provided)
  if (values.phone && !/^\d+$/.test(values.phone)) {
    errors.phone = 'Phone number must contain only digits';
  }

  // Description word count
  if (values.description) {
    const wordCount = values.description.trim().split(/\s+/).length;
    if (wordCount > 1000) {
      errors.description = `Description cannot exceed 1000 words (currently ${wordCount})`;
    }
  }

  // Delivery date
  if (!values.deliveryDate) {
    errors.deliveryDate = 'Delivery date is required';
  }

  // Full amount
  if (values.fullAmount === '' || values.fullAmount === undefined || values.fullAmount === null) {
    errors.fullAmount = 'Full amount is required';
  } else if (!Number.isInteger(Number(values.fullAmount)) || Number(values.fullAmount) < 0) {
    errors.fullAmount = 'Full amount must be a positive whole number';
  }

  // Advance amount
  if (values.advanceAmount !== '' && values.advanceAmount !== undefined && values.advanceAmount !== null) {
    if (!Number.isInteger(Number(values.advanceAmount)) || Number(values.advanceAmount) < 0) {
      errors.advanceAmount = 'Advance amount must be a positive whole number';
    } else if (Number(values.advanceAmount) > Number(values.fullAmount)) {
      errors.advanceAmount = 'Advance amount cannot exceed full amount';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

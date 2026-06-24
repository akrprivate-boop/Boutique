import config from '../config/config';

/**
 * Date & Currency Formatting Utilities
 */

/**
 * Format a date string to DD-MM-YYYY
 */
export function formatDateDMY(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

/**
 * Format a date string to YYYY-MM-DD (for HTML date inputs)
 */
export function formatDateISO(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

/**
 * Convert DD-MM-YYYY to YYYY-MM-DD
 */
export function dmyToISO(dmyStr) {
  if (!dmyStr) return '';
  const [dd, mm, yyyy] = dmyStr.split('-');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format currency with Indian formatting (₹1,23,456)
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '—';
  const num = Number(amount);
  return `${config.currency.symbol}${num.toLocaleString(config.currency.locale)}`;
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Truncate text to a max length
 */
export function truncate(text, maxLength = 50) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
}

/**
 * Calculate pending amount
 */
export function calcPending(fullAmount, advanceAmount) {
  return (Number(fullAmount) || 0) - (Number(advanceAmount) || 0);
}

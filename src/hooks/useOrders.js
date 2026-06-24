import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';

/**
 * Hook for loading and managing order data
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getFiltered(filters);
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const data = await orderService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadOrders(), loadSummary()]);
  }, [loadOrders, loadSummary]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    orders,
    summary,
    isLoading,
    error,
    loadOrders,
    loadSummary,
    refresh,
  };
}

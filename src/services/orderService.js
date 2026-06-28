import { supabase } from './supabase';

/**
 * Order Service — CRUD operations for the orders table
 */
export const orderService = {
  /**
   * Get all orders with customer data
   */
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Get all orders with filters
   */
  async getFiltered({ search, entryDateFrom, entryDateTo, deliveryDateFrom, deliveryDateTo, deliveryStatus }) {
    let query = supabase
      .from('orders')
      .select('*, customer:customers(*)');

    if (entryDateFrom) {
      query = query.gte('entry_date', entryDateFrom);
    }
    if (entryDateTo) {
      query = query.lte('entry_date', entryDateTo);
    }
    if (deliveryDateFrom) {
      query = query.gte('delivery_date', deliveryDateFrom);
    }
    if (deliveryDateTo) {
      query = query.lte('delivery_date', deliveryDateTo);
    }
    if (deliveryStatus !== undefined && deliveryStatus !== null && deliveryStatus !== 'all') {
      query = query.eq('delivery_status', deliveryStatus === 'delivered');
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Client-side search by name or phone
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      return data.filter(
        (order) =>
          order.customer?.name?.toLowerCase().includes(s) ||
          order.customer?.phone?.includes(s)
      );
    }

    return data;
  },

  /**
   * Get pending deliveries for a specific month (for calendar)
   */
  async getDeliveriesForMonth(year, month) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .eq('delivery_status', false)
      .gte('delivery_date', startDate)
      .lte('delivery_date', endDate)
      .order('delivery_date');
    if (error) throw error;
    return data;
  },

  /**
   * Get all deliveries for a specific date (for calendar detail table)
   */
  async getDeliveriesForDate(dateStr) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*)')
      .eq('delivery_date', dateStr)
      .eq('delivery_status', false)
      .order('entry_date');
    if (error) throw error;
    return data;
  },

  /**
   * Get summary statistics
   */
  async getSummary() {
    const { data: allOrders, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*)');
    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const pendingOrders = allOrders.filter((o) => !o.delivery_status);
    const todaysDeliveries = pendingOrders.filter((o) => o.delivery_date === today);
    const totalPending = pendingOrders.reduce(
      (sum, o) => sum + (o.full_amount - o.advance_amount),
      0
    );
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.full_amount, 0);

    // Monthly revenue for chart (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      const monthEnd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

      const monthOrders = allOrders.filter(
        (o) => o.entry_date >= monthStart && o.entry_date <= monthEnd
      );
      monthlyRevenue.push({
        month: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.full_amount, 0),
        collected: monthOrders.reduce((sum, o) => sum + o.advance_amount, 0),
        orders: monthOrders.length,
      });
    }

    return {
      totalCustomers: new Set(allOrders.map((o) => o.customer_id)).size,
      totalOrders: allOrders.length,
      pendingDeliveries: pendingOrders.length,
      todaysDeliveries: todaysDeliveries.length,
      totalPendingAmount: totalPending,
      totalRevenue,
      monthlyRevenue,
    };
  },

  /**
   * Generate a unique human-readable order number
   */
  async generateOrderNumber() {
    const year = new Date().getFullYear();
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    const num = (count || 0) + 1;
    return `ORD-${year}-${String(num).padStart(4, '0')}`;
  },

  /**
   * Create a new order
   */
  async create(orderData) {
    const orderNumber = await this.generateOrderNumber();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_id: orderData.customer_id,
        customer_type: orderData.customer_type,
        entry_date: orderData.entry_date,
        description: orderData.description || '',
        delivery_date: orderData.delivery_date,
        full_amount: orderData.full_amount,
        advance_amount: orderData.advance_amount || 0,
        delivery_status: false,
      })
      .select('*, customer:customers(*)')
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update an existing order
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, customer:customers(*)')
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Mark an order as delivered
   */
  async markAsDelivered(id) {
    return this.update(id, { delivery_status: true });
  },

  /**
   * Delete an order
   */
  async deleteOrder(id) {
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  },
};

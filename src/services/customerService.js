import { supabase } from './supabase';

/**
 * Customer Service — CRUD operations for the customers table
 */
export const customerService = {
  /**
   * Get all customers with their orders
   */
  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Get a single customer by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Search customers by name or phone
   */
  async search(query) {
    if (!query || query.trim().length === 0) return [];

    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(*)')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name');
    if (error) throw error;
    return data;
  },

  /**
   * Get customers who have no active (pending) orders
   * These are eligible for new orders
   */
  async getAvailableForNewOrder() {
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders!inner(*)')
      .order('name');

    if (error) throw error;

    // Filter to customers whose all orders are delivered
    // (i.e., no active orders)
    return (data || []).filter((customer) =>
      customer.orders.every((order) => order.delivery_status === true)
    );
  },

  /**
   * Search available customers (no active orders)
   */
  async searchAvailable(query) {
    if (!query || query.trim().length === 0) return [];

    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(*)')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name');
    if (error) throw error;

    // Filter to customers who have no pending orders
    return (data || []).filter(
      (customer) =>
        !customer.orders ||
        customer.orders.length === 0 ||
        customer.orders.every((order) => order.delivery_status === true)
    );
  },

  /**
   * Create a new customer
   */
  async create(customerData) {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        phone: customerData.phone || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update customer details
   */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

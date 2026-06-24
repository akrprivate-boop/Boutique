import { supabase } from './supabase';

/**
 * Audit Service
 * 
 * Note: Audit logging is also handled automatically via database triggers.
 * This service is for reading the audit log from the UI if needed.
 */
export const auditService = {
  /**
   * Get audit log entries for a specific record
   */
  async getForRecord(tableName, recordId) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Get recent audit log entries
   */
  async getRecent(limit = 50) {
    const { data, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

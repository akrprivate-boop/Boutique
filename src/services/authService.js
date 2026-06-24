import config from '../config/config';

const SESSION_KEY = 'boutique_auth_session';
const SESSION_EXPIRY_HOURS = 24;

/**
 * Authentication Service
 * 
 * Phase 1: Validates credentials against config.js
 * Phase 2: Replace with Supabase Auth (supabase.auth.signIn...)
 */
export const authService = {
  /**
   * Login with username and password
   * Returns true on success, false on failure
   */
  login(username, password) {
    if (
      username === config.auth.username &&
      password === config.auth.password
    ) {
      const session = {
        user: username,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
        ).toISOString(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  },

  /**
   * Logout — clear session
   */
  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return false;

      const parsed = JSON.parse(session);
      const now = new Date();
      const expiry = new Date(parsed.expiresAt);

      if (now > expiry) {
        localStorage.removeItem(SESSION_KEY);
        return false;
      }

      return true;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
  },

  /**
   * Get current session info
   */
  getSession() {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },
};

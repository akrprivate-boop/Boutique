import { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const valid = authService.isAuthenticated();
    setIsAuthenticated(valid);
    setIsLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const success = authService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

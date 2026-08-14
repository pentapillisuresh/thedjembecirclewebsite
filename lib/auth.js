'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Set token in ApiService
          ApiService.setToken(token);
          setAuthUser(parsedUser);
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
        ApiService.setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData) => {
    setAuthUser(userData);
    return { success: true };
  };

  const register = (userData) => {
    // Store in registered users (mock for now - actual registration handled by API)
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.phone === userData.phone)) {
      return { success: false, error: 'Phone number already registered' };
    }
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return { success: true };
  };

  const logout = () => {
    setAuthUser(null);
    ApiService.setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLogin');
    // Optional: Clear registered users if needed
    // localStorage.removeItem('registeredUsers');
  };

  const updateUser = (userData) => {
    if (user) {
      const updated = { ...user, ...userData };
      setAuthUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return { success: true };
    }
    return { success: false, error: 'No user logged in' };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
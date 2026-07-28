'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser, removeUser } from './storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    if (stored) setAuthUser(stored);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setAuthUser(userData);
    return { success: true };
  };

  const register = (userData) => {
    // Store in registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return { success: true };
  };

  const logout = () => {
    removeUser();
    setAuthUser(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    setUser(updated);
    setAuthUser(updated);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
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
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/authApi';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authAPI.login(credentials);
      const { token, user: userData } = res.data;

      // ✅ DEBUG: Check if role exists
      if (!userData?.role) {
        console.warn('User role missing in login response. Role-based redirects may not work.');
      }

      // Store token and sync login event
      localStorage.setItem('token', token);
      localStorage.setItem('auth-event', 'login');

      setUser(userData); // Should contain role
      return userData;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('auth-event', 'login');

      setUser(user); // Should contain role
      return user;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.setItem('auth-event', 'logout');
      setUser(null);
      setLoading(false);
    }
  };

  // 🔁 RESTORE SESSION on reload
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getCurrentUser();
        const userData = res.data;

        if (!userData?.role) {
          console.warn('User role missing in session restore. Role-based redirects may fail.');
        }

        setUser(userData); // Should contain .role
      } catch (err) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 🌐 CROSS-TAB login/logout sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'auth-event') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading ? children : <div className="text-center mt-10">Loading session...</div>}
    </AuthContext.Provider>
  );
};

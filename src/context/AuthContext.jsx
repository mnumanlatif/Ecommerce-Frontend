/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/authApi';
import { toast } from 'react-toastify';

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
      const { token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('auth-event', 'login');

      // ✅ Immediately fetch current user
      const userRes = await authAPI.getCurrentUser();
      setUser(userRes.data);

      toast.success(`Welcome back, ${userRes.data.name || 'User'}!`);
      return userRes.data;
    } catch (error) {
      setUser(null);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
      const { token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('auth-event', 'login');

      // ✅ Immediately fetch current user
      const userRes = await authAPI.getCurrentUser();
      setUser(userRes.data);

      toast.success(`Registration successful. Welcome, ${userRes.data.name || 'User'}!`);
      return userRes.data;
    } catch (error) {
      setUser(null);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
      toast.info('You have been logged out.');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('token');
      localStorage.setItem('auth-event', 'logout');
      setUser(null);
      setLoading(false);
    }
  };

  // 🔁 RESTORE SESSION
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
        setUser(res.data);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 🌐 CROSS-TAB Sync
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

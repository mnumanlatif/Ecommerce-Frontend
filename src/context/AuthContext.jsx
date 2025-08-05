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

  // Helper: Save token & broadcast auth event for cross-tab sync
  const saveToken = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth-event', 'login');
  };

  // Helper: Clear token & broadcast logout event
  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.setItem('auth-event', 'logout');
  };

  // 🔐 LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      // 1) Call login API to get token
      const res = await authAPI.login(credentials);
      const { token } = res.data;

      // 2) Save token to localStorage
      saveToken(token);

      // 3) Use token to get full user info (make sure authAPI.getCurrentUser sends token in header)
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

  // 📝 REGISTER (NO getCurrentUser call here)
  const register = async (userData) => {
    setLoading(true);
    try {
      await authAPI.register(userData);

      // No token or current user fetch here
      setUser(null);

      toast.success('Registration successful! Please login to continue.');
      return null;
    } catch (error) {
      setUser(null);
      // toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
      clearToken();
      setUser(null);
      setLoading(false);
    }
  };

  // 🔁 RESTORE SESSION on page reload
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
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // 🌐 CROSS-TAB LOGIN/LOGOUT sync: reload tab when another tab logs in/out
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

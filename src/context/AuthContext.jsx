/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/authApi';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⏳ LOGIN
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authAPI.login(credentials);
      localStorage.setItem('token', res.data.token); // store JWT
      localStorage.setItem('auth-event', 'login');   // sync tabs
      setUser(res.data.user);
      return res;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 📝 REGISTER (store token just like login)
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      localStorage.setItem('token', res.data.token); // <-- Add this line
      localStorage.setItem('auth-event', 'login');
      setUser(res.data.user);
      return res;
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
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.setItem('auth-event', 'logout');
      setUser(null);
      setLoading(false);
    }
  };

  // 🔁 Restore session on reload
  useEffect(() => {
    const fetchUser = async () => {
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
        localStorage.removeItem('token'); // session expired or invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🌐 Cross-tab sync (login/logout across browser tabs)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'auth-event') {
        window.location.reload(); // auto-refresh to sync session
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

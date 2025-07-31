/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const login = async (credentials) => {
  setLoading(true);
  try {
    const res = await authAPI.login(credentials);
    // Save JWT token in localStorage (important)
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    localStorage.setItem('auth-event', 'login'); // sync across tabs
    return res;
  } catch (error) {
    setUser(null);
    throw error;
  } finally {
    setLoading(false);
  }
};



  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      setUser(res.data.user);
      localStorage.setItem('auth-event', 'login');
      return res;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const logout = async () => {
  setLoading(true);
  try {
    await authAPI.logout();
    setUser(null);
    localStorage.removeItem('token');   // <== Add this line
    localStorage.setItem('auth-event', 'logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    setLoading(false);
  }
};



  // Check session on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Sync login/logout across browser tabs
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

export const useAuth = () => useContext(AuthContext);

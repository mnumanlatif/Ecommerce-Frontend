import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true,
});

export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/current-user');
export const logout = () => api.post('/logout');
export const register = (userData) => api.post('/register', userData);

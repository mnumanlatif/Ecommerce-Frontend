import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  withCredentials: true,
});

// Request interceptor to add token header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/current-user');
export const logout = () => api.post('/logout');
export const register = (userData) => api.post('/register', userData);

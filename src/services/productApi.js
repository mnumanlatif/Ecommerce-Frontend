// src/services/productService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_PRODUCT_API_BASE_URL || 'http://localhost:5172/api/products';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // include this if using cookies/session
});

export const getAllProducts = async () => {
  const response = await api.get('/');
  return response.data;
};

// You can export default if needed:
export default {
  getAllProducts,
};

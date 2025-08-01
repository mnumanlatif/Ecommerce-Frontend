import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/CartContext'; // ✅ Make sure this file exists

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);

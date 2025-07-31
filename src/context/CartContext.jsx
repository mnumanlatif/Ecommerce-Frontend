/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const addToCart = async (product) => {
    try {
      const res = await axios.post(
        'http://localhost:5005/api/cart/add',
        { ...product, quantity: 1 },
        config
      );
      setCart(res.data.items); // assuming backend returns updated cart
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

    const removeFromCart = async (productId) => {
    try {
      await axios.delete('http://localhost:5005/api/cart/remove', {
        headers: config.headers,
        data: { productId },
      });
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        'http://localhost:5005/api/cart/update',
        { productId, quantity },
        config
      );
      setCart(res.data.items); // assuming backend returns updated cart
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

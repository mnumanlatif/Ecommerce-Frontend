/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // user._id available here
  const [cart, setCart] = useState([]);

  // Helper: get token headers
  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // 🛒 Fetch cart items when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user?._id) return;

        const res = await axios.get(
          `http://localhost:5005/api/cart/cart?userId=${user._id}`,
          getConfig()
        );

        setCart(res.data.items || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setCart([]);
      }
    };

    fetchCart();
  }, [user]);

  // Add item to cart
const addToCart = async (product) => {
  try {
    if (!user?._id) {
      console.warn('User not logged in');
      return;
    }

    const cartPayload = {
      userId: user._id,
      items: [
        {
          productId: product._id || product.id,
          name: product.title || product.name || 'Unnamed',
          price: product.price || 0,
          imageUrl: product.imageUrl || '',
          quantity: 1,
        },
      ],
    };

    console.log('✅ Sending to backend:', cartPayload);

    const res = await axios.post(
      'http://localhost:5005/api/cart/add',
      cartPayload,
      getConfig()
    );

    setCart(res.data.cart?.items || []);
  } catch (err) {
    console.error('🚨 Error adding to cart:', err?.response?.data || err.message);
  }
};


const removeFromCart = async (productId) => {
  try {
    if (!user?._id) {
      console.warn('User not logged in');
      return;
    }

    await axios.post(
      'http://localhost:5005/api/cart/remove',
      { userId: user._id, productId },
      getConfig()
    );

    setCart((prev) => prev.filter((item) => item.productId !== productId));
  } catch (err) {
    console.error('Error removing from cart:', err);
  }
};


  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        'http://localhost:5005/api/cart/update',
        { productId, quantity },
        getConfig()
      );
      setCart(res.data.items || []);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
        addToCart,
        removeFromCart,
        updateQuantity,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

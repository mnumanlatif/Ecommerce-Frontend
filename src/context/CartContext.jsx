/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const getConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Fetch cart items when user logs in or changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?._id) {
        setCart([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5005/api/cart/cart?userId=${user._id}`,
          getConfig()
        );
        setCart(res.data.items || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setCart([]);
        toast.error('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (product) => {
    if (!user?._id) {
      toast.warning('Please login to add items to your cart.');
      return;
    }
    try {
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
      const res = await axios.post(
        'http://localhost:5005/api/cart/add',
        cartPayload,
        getConfig()
      );
      setCart(res.data.cart?.items || []);
      // toast.success('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err?.response?.data || err.message);
      toast.error('Failed to add item to cart.');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user?._id) {
      toast.warning('Please login to remove items from your cart.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5005/api/cart/remove',
        { userId: user._id, productId },
        getConfig()
      );
      // Refresh cart after removal
      const res = await axios.get(
        `http://localhost:5005/api/cart/cart?userId=${user._id}`,
        getConfig()
      );
      setCart(res.data.items || []);
      toast.info('Item removed from cart.');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove item from cart.');
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (productId, quantity) => {
    if (!user?._id) {
      toast.warning('Please login to update your cart.');
      return;
    }
    try {
      const res = await axios.put(
        'http://localhost:5005/api/cart/update',
        { userId: user._id, productId, quantity },
        getConfig()
      );
      setCart(res.data.items || []);
      // toast.success('Cart updated.');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update cart.');
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user?._id) {
      toast.warning('Please login to clear your cart.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5005/api/cart/clear',
        { userId: user._id },
        getConfig()
      );
      setCart([]);
      // toast.info('Cart cleared.');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCart, // usually avoid exposing setCart, but included if needed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

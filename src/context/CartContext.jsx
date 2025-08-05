/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';  // import toastify

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
        // toast.error('Failed to load cart items.');
      }
    };

    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (product) => {
    try {
      if (!user?._id) {
        toast.warning('Please login to add items to your cart.');
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
      // toast.success('Item added to cart!');
    } catch (err) {
      console.error('🚨 Error adding to cart:', err?.response?.data || err.message);
      toast.error('Failed to add item to cart.');
    }
  };

const removeFromCart = async (userId, productId) => {
  try {
    if (!userId) {
      toast.warning('Please login to remove items from your cart.');
      return;
    }

    await axios.post(
      'http://localhost:5005/api/cart/remove',
      { userId, productId },
      getConfig() // your axios config with auth headers etc
    );

    // Fetch updated cart after removal
    const res = await axios.get(
      `http://localhost:5005/api/cart/cart?userId=${userId}`,
      getConfig()
    );

    setCart(res.data.items || []);  // Update cart state here

    toast.info('Item removed from cart.');
  } catch (err) {
    console.error('Error removing from cart:', err);
    toast.error('Failed to remove item from cart.');
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
      toast.success('Cart updated.');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update cart.');
    }
  };

  const clearCart = async (userId) => {
  try {
    await axios.post('http://localhost:5005/api/cart/clear', { userId }, getConfig());
    setCart([]);  // clear local cart state immediately
    // toast.info('Cart cleared.');
  } catch (err) {
    toast.error('Failed to clear cart.');
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

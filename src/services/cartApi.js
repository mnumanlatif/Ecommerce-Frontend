import axios from "axios";

const BASE_URL = "http://localhost:5005/api/cart";

// Helper to get Authorization headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage.");
    return {}; // No headers if token is missing
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Add item to cart
export const addToCart = async (cartData) => {
  try {
    console.log('Sending cart data:', cartData);
    const res = await axios.post(`${BASE_URL}/add`, cartData, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error('Add to cart error:', err.response?.data || err.message);
    throw err;
  }
};

// Remove item from cart
export const removeFromCart = async (userId, productId) => {
  const token = localStorage.getItem('token');
  return await axios.post('http://localhost:5005/api/cart/remove', {
    userId,
    productId,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// Checkout cart
export const checkout = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/checkout`, {}, getAuthHeaders());
    return res.data;
  } catch (err) {
    console.error('Checkout error:', err.response?.data || err.message);
    throw err;
  }
};

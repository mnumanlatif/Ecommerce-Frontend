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
    console.log('Add to cart response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Add to cart error:', err.response?.data || err.message);
    throw err;
  }
};

// Remove item from cart
export const removeFromCart = async (userId, productId) => {
  try {
    console.log('Removing from cart:', { userId, productId });
    const res = await axios.post(
      `${BASE_URL}/remove`,
      { userId, productId },
      getAuthHeaders()
    );
    console.log('Remove from cart response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Remove from cart error:', err.response?.data || err.message);
    throw err;
  }
};

// Checkout cart
export const checkout = async () => {
  try {
    console.log('Checkout initiated');
    const res = await axios.post(`${BASE_URL}/checkout`, {}, getAuthHeaders());
    console.log('Checkout response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Checkout error:', err.response?.data || err.message);
    throw err;
  }
};

export const updateQuantity = async (productId, quantity) => {
  const user = JSON.parse(localStorage.getItem('user')); // or get from context
  const userId = user?._id;

  return axios.put(
    `${BASE_URL}/update-quantity`,
    { userId, productId, quantity },
    getAuthHeaders() // ⬅️ ADD THIS
  );
};



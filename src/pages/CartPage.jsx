import React, { useEffect, useState } from 'react';
import { removeFromCart, checkout } from '../services/cartApi';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5005/api/cart/cart?userId=${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(user._id, productId);
      setCart(cart.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await checkout(user._id);
      alert('Checkout successful!');
      setCart([]);
      console.log('Order:', res.order);
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed');
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    fetchCart(); // fetchCart already checks if user/token exist
  }, [user]);

  if (loading) return <div className="text-center mt-10">Loading cart...</div>;

  if (cart.length === 0)
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to your cart to see them here.</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* LEFT: Cart Items List */}
      <div className="flex-1 border rounded-lg shadow-lg p-6 bg-white">
        <h2 className="text-3xl font-semibold mb-6">Shopping Cart</h2>

        {cart.map(item => (
          <div key={item.productId} className="flex items-center gap-4 mb-6 border-b pb-4">
            <img
              src={item.imageUrl || 'https://via.placeholder.com/80'}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-500">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemove(item.productId)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT: Order Summary Side Card */}
      <div className="w-full md:w-96 border rounded-lg shadow-lg p-6 bg-white flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="flex flex-col gap-3 flex-grow overflow-y-auto max-h-[400px] mb-4">
          {cart.map(item => (
            <div key={item.productId} className="flex justify-between items-center">
              <p className="truncate">{item.name} x {item.quantity}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

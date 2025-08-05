/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { removeFromCart } from '../services/cartApi';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DEFAULT_IMAGE = 'https://via.placeholder.com/300';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) return setLoading(false);

    try {
      const res = await axios.get(
        `http://localhost:5005/api/cart/cart?userId=${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

const handleRemove = async (productId) => {
  try {
    await removeFromCart(user._id, productId);
    toast.success('Item removed!');

    // Fetch updated cart
    const res = await axios.get(
      `http://localhost:5005/api/cart/cart?userId=${user._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    const updatedItems = res.data.items || [];
    setCartCount(updatedItems.length); // ⬅️ update navbar
  } catch {
    // toast.error('Could not remove item.');
  }
};



  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(productId, quantity);
    } catch {
      toast.error('Failed to update quantity.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, total } });
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [user]);

  return (
    <section className="min-h-screen bg-gray-900 text-gray-100 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            🛒 Your Cart
          </h1>
          <p className="text-gray-400 mt-2">Review your items before checkout</p>
          <div className="mt-4 w-20 h-1 bg-indigo-500 rounded-full mx-auto shadow-lg"></div>
        </header>

        {loading ? (
          <p className="text-center text-indigo-400 text-xl animate-pulse">
            Loading your cart...
          </p>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Items */}
            <div className="md:col-span-2 space-y-8">
              {cart.map((item, i) => (
                <div
                  key={item.productId}
                  className="bg-gray-800 rounded-3xl p-6 shadow-lg shadow-indigo-700/30 hover:shadow-indigo-700/50
                             transform transition duration-300 hover:scale-[1.02] flex gap-6 items-center"
                  style={{
                    animation: `fadeInUp 0.5s ease forwards`,
                    animationDelay: `${i * 0.1}s`,
                    willChange: 'transform, box-shadow',
                  }}
                >
                  <img
                    src={item.imageUrl || DEFAULT_IMAGE}
                    alt={item.name}
                    className="w-28 h-28 rounded-xl object-cover border border-indigo-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-indigo-300">{item.name}</h3>
                    <p className="text-indigo-400 text-sm line-clamp-2 mb-2">
                      {item.description || 'No description.'}
                    </p>
                    <p className="text-indigo-500 text-lg font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center bg-gray-700 px-4 py-1 rounded-full">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="text-indigo-400 text-xl px-2 hover:text-indigo-300"
                      >
                        −
                      </button>
                      <span className="mx-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="text-indigo-400 text-xl px-2 hover:text-indigo-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary */}
            <div className="bg-gray-800 rounded-3xl p-6 shadow-lg shadow-indigo-700/30 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-indigo-300 mb-4">Summary</h2>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-gray-300"
                    >
                      <span className="truncate">
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-indigo-500 pt-4">
                <p className="text-xl font-bold text-indigo-400 mb-4">
                  Total: ${total.toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600
                             text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Style */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default CartPage;

// /* eslint-disable no-undef */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderSuccessModal from './OrderSuccessModal';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};
  const { clearCart} = useCart();
  const { user } = useAuth(); 
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'card',
  });
  const [loading, setLoading] = useState(false);

  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
        <h2 className="text-3xl font-semibold mb-6">🛒 No items to checkout</h2>
        <button
          onClick={() => navigate('/cart')}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Cart
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem('token')?.replace(/^"(.*)"$/, '$1');
    if (!token) {
      toast.error('Please login to proceed with checkout.');
      navigate('/login');
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId || item._id || item.id,
      quantity: item.quantity ?? 1,
      price: item.price ?? 10,
    }));

    const orderData = {
      items,
      total,
      shippingDetails: formData,
      paymentMethod: formData.paymentMethod,
    };

    const res = await axios.post('http://localhost:7000/api/pay/pay', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.data.success) {
      setShowModal(true);
       await clearCart(user._id); // clear the entire cart at once
    } else {
      toast.error('Payment failed, please try again.');
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};
  const handleModalClose = () => {
    setShowModal(false);
    navigate('/orders');
  };
  return (
    <section className="min-h-screen bg-gray-100 text-gray-800 py-14 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-10 border-b pb-4 text-center">
          💳 Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="mb-2 font-semibold text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Muhammad Numan"
                className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-2 font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+92-123456789"
                className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-2 font-semibold text-gray-700">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Gulberg Lahore"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 font-semibold text-gray-700">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Lahore"
                className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="postalCode" className="mb-2 font-semibold text-gray-700">
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                required
                placeholder="54000"
                className="px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                       text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            {loading ? 'Placing Order...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      {showModal && <OrderSuccessModal onClose={handleModalClose} />}
    </section>
  );
};

export default CheckoutPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderSuccessModal from './OrderSuccessModal';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};

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
  const [error, setError] = useState('');

  if (!cart.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">No items to checkout</h2>
        <button
          onClick={() => navigate('/cart')}
          className="text-indigo-600 font-semibold hover:underline transition"
        >
          Back to Cart
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
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      // Construct order data with productId, quantity, price
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setShowModal(true);
      } else {
        setError('Payment failed, please try again.');
      }
    } catch (err) {
      console.error('Order failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/orders');
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 border-b pb-4">Checkout</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
                className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {error && (
            <p className="text-red-600 font-semibold text-center bg-red-100 rounded p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg shadow-lg transition"
          >
            {loading ? 'Placing Order...' : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      {showModal && <OrderSuccessModal onClose={handleModalClose} />}
    </>
  );
};

export default CheckoutPage;

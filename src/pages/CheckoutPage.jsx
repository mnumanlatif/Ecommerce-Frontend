import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import OrderSuccessModal from '../components/OrderSuccessModal';
import JazzCashModal from '../components/JazzCashModal';
import EasyPaisaModal from '../components/EasyPaisaModal';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || {};
  const { clearCart } = useCart();
  const { user } = useAuth();

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showJazzCashModal, setShowJazzCashModal] = useState(false);
  const [showEasyPaisaModal, setShowEasyPaisaModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [jazzCashData, setJazzCashData] = useState({ phone: '', email: '' });
  const [easyPaisaData, setEasyPaisaData] = useState({ phone: '', email: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: '',
    selectedOnlineMethod: '',
  });

  useEffect(() => {
    if (formData.paymentMethod === 'online') {
      if (formData.selectedOnlineMethod === 'jazzcash') {
        setShowJazzCashModal(true);
        setShowEasyPaisaModal(false);
      } else if (formData.selectedOnlineMethod === 'easypaisa') {
        setShowEasyPaisaModal(true);
        setShowJazzCashModal(false);
      } else {
        setShowJazzCashModal(false);
        setShowEasyPaisaModal(false);
      }
    } else {
      setShowJazzCashModal(false);
      setShowEasyPaisaModal(false);
    }
  }, [formData.selectedOnlineMethod, formData.paymentMethod]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJazzCashSubmit = async (e) => {
    e.preventDefault();
    toast.success('JazzCash payment info submitted!');
    setShowJazzCashModal(false);
  };

  const handleEasyPaisaSubmit = async (e) => {
    e.preventDefault();
    toast.success('EasyPaisa payment info submitted!');
    setShowEasyPaisaModal(false);
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
        paymentMethod:
          formData.paymentMethod === 'online'
            ? formData.selectedOnlineMethod
            : 'cod',
      };

      const res = await axios.post('http://localhost:7000/api/pay/pay', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        setShowOrderModal(true);
        await clearCart(user._id);
      } else {
        toast.error('Payment failed, please try again.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderModalClose = () => {
    setShowOrderModal(false);
    navigate('/orders');
  };

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

  return (
    <section className="min-h-screen bg-gray-100 text-gray-800 py-14 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 border border-gray-200">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-10 border-b pb-4 text-center">
          💳 Checkout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="mb-2 font-semibold text-gray-700">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Muhammad Numan"
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-2 font-semibold text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+92-123456789"
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="mb-2 font-semibold text-gray-700">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Gulberg Lahore"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* City & Postal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-2 font-semibold text-gray-700">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Lahore"
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="postalCode" className="mb-2 font-semibold text-gray-700">Postal Code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                required
                placeholder="54000"
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="flex flex-col">
            <label className="mb-4 text-lg font-bold text-gray-800">Select Payment Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD */}
              <label className={`border rounded-xl px-5 py-4 flex items-center space-x-4 shadow-sm cursor-pointer transition-all duration-200
                ${formData.paymentMethod === 'cod' ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="accent-blue-600 scale-110"
                />
                <div>
                  <p className="font-medium text-gray-800">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when the order arrives</p>
                </div>
              </label>

              {/* Online */}
              <label className={`border rounded-xl px-5 py-4 flex items-center space-x-4 shadow-sm cursor-pointer transition-all duration-200
                ${formData.paymentMethod === 'online' ? 'border-blue-600 ring-2 ring-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, selectedOnlineMethod: '' }));
                  }}
                  className="accent-blue-600 scale-110"
                />
                <div>
                  <p className="font-medium text-gray-800">Online Payment</p>
                  <p className="text-sm text-gray-500">Secure card & wallet payments</p>
                </div>
              </label>
            </div>
          </div>

          {/* Sub Methods */}
          {/* Online Methods - Suboptions */}
{formData.paymentMethod === 'online' && (
  <div className="flex flex-col mt-6">
    <label className="mb-3 text-lg font-semibold text-gray-800">Choose Online Method</label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* JazzCash Option */}
      <label
        className={`border rounded-xl px-5 py-4 flex justify-between items-center shadow-sm cursor-pointer transition-all duration-200
        ${
          formData.selectedOnlineMethod === 'jazzcash'
            ? 'border-red-500 ring-2 ring-red-300 bg-red-50'
            : 'border-gray-300 hover:border-red-400'
        }`}
        onClick={() => {
          setFormData((prev) => ({
            ...prev,
            selectedOnlineMethod: 'jazzcash',
          }));
          setShowJazzCashModal(true); // open modal on click
        }}
      >
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            name="selectedOnlineMethod"
            value="jazzcash"
            checked={formData.selectedOnlineMethod === 'jazzcash'}
            readOnly
            className="accent-red-500 scale-110"
          />
          <div>
            <p className="font-medium text-gray-800">JazzCash</p>
            <p className="text-sm text-gray-500">Mobile wallet payment</p>
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-red-500 font-semibold underline"
          onClick={(e) => {
            e.stopPropagation(); // prevent label click
            setShowJazzCashModal(true);
          }}
        >
        </button>
      </label>

      {/* EasyPaisa Option */}
      <label
        className={`border rounded-xl px-5 py-4 flex justify-between items-center shadow-sm cursor-pointer transition-all duration-200
        ${
          formData.selectedOnlineMethod === 'easypaisa'
            ? 'border-green-500 ring-2 ring-green-300 bg-green-50'
            : 'border-gray-300 hover:border-green-400'
        }`}
        onClick={() => {
          setFormData((prev) => ({
            ...prev,
            selectedOnlineMethod: 'easypaisa',
          }));
          setShowEasyPaisaModal(true); // open modal on click
        }}
      >
        <div className="flex items-center space-x-4">
          <input
            type="radio"
            name="selectedOnlineMethod"
            value="easypaisa"
            checked={formData.selectedOnlineMethod === 'easypaisa'}
            readOnly
            className="accent-green-500 scale-110"
          />
          <div>
            <p className="font-medium text-gray-800">EasyPaisa</p>
            <p className="text-sm text-gray-500">Mobile wallet payment</p>
          </div>
        </div>
        <button
          type="button"
          className="text-sm text-green-500 font-semibold underline"
          onClick={(e) => {
            e.stopPropagation();
            setShowEasyPaisaModal(true);
          }}
        >

        </button>
      </label>
    </div>
  </div>
)}


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

      {showOrderModal && <OrderSuccessModal onClose={handleOrderModalClose} />}
      {showJazzCashModal && (
  <JazzCashModal
    onClose={() => setShowJazzCashModal(false)}
    onSubmit={handleJazzCashSubmit}
    formData={jazzCashData}
    setFormData={setJazzCashData}
  />
)}

{showEasyPaisaModal && (
  <EasyPaisaModal
    onClose={() => setShowEasyPaisaModal(false)}
    onSubmit={handleEasyPaisaSubmit}
    formData={easyPaisaData}
    setFormData={setEasyPaisaData}
  />
)}

    </section>
  );
};

export default CheckoutPage;

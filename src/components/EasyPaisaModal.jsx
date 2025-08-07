import React from 'react';
import { IoClose } from 'react-icons/io5';

const EasyPaisaModal = ({ onClose, onSubmit, formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="relative w-full max-w-lg bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-8 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-2xl transition duration-200"
        >
          <IoClose />
        </button>

        <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
          EasyPaisa Payment
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Mobile Number */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-gray-700 font-semibold mb-2">
              Mobile Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+92xxxxxxxxxx"
              className="px-5 py-3 border border-white/40 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 font-semibold mb-2">
              Email (optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="px-5 py-3 border border-white/40 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition duration-300"
          >
            Confirm & Pay with EasyPaisa
          </button>
        </form>
      </div>
    </div>
  );
};

export default EasyPaisaModal;

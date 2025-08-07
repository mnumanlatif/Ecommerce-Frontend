import React from 'react';
import { IoClose } from 'react-icons/io5';

const JazzCashModal = ({ onClose, onSubmit, formData, setFormData }) => {
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

        <h2 className="text-4xl font-extrabold text-center text-[#ec1c24] mb-8 drop-shadow-md">
          JazzCash Payment
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-800">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92-3001234567"
              className="px-5 py-3 border border-white/40 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#ec1c24] focus:outline-none transition duration-200"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="px-5 py-3 border border-white/40 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-[#ec1c24] focus:outline-none transition duration-200"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#ec1c24] to-red-600 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
          >
            Confirm & Pay with JazzCash
          </button>
        </form>
      </div>
    </div>
  );
};

export default JazzCashModal;

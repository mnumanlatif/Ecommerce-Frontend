/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const user = await register(form);
      toast.success('Registered successfully! Please login to continue.');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Error: ' + (err?.message || 'Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[2rem] backdrop-blur-3xl bg-white/10 border border-white/20 shadow-2xl p-10 space-y-6 text-white relative"
      >
        {/* Floating Glass Shine */}
        <div className="absolute -top-1 -left-1 w-full h-full rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent blur-[3px] z-0 pointer-events-none" />

        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow">
          Create Account
        </h2>

        {/* Full Name */}
        <div className="relative">
          <label className="block text-sm font-semibold text-indigo-300 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 bg-white/5 border border-indigo-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition duration-200"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-semibold text-indigo-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 bg-white/5 border border-indigo-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition duration-200"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-semibold text-indigo-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-4 py-3 bg-white/5 border border-indigo-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition duration-200"
          />
        </div>

        {/* Role */}
        <div className="relative">
          <label className="block text-sm font-semibold text-indigo-300 mb-1">Select Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/5 border border-indigo-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition duration-200"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:brightness-110 hover:scale-[1.02] ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-indigo-200">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-pink-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

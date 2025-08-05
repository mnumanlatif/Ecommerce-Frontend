import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login({ email: form.email, password: form.password });

      if (!user || !user.role) {
        toast.error('Login failed: User role missing.');
        setLoading(false);
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin/add-product');
      } else {
        navigate('/products');
      }

    } catch (err) {
      console.error('Login failed', err);
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-3xl p-8 border border-gray-200 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md transition ${
              loading
                ? 'bg-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-purple-600 hover:underline font-medium"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

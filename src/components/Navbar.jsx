import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(null); // null → to avoid flash of 0

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        if (!user?._id) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(
          `http://localhost:5005/api/cart/cart?userId=${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true, // 👈 If you're using cookies/session
          }
        );

        const cartItems = res.data.items || [];
        setCartCount(cartItems.length);
      } catch (err) {
        console.error('Failed to fetch cart count:', err.message);
        setCartCount(0);
      }
    };

    fetchCartQuantity();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 shadow-md flex items-center justify-between">
      <Link to="/products" className="text-2xl font-bold tracking-wide hover:underline">
        🛒 Product Catalog
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/cart" className="flex items-center relative hover:text-gray-200">
          <ShoppingCart className="w-5 h-5" />
          <span className="ml-1">Cart</span>

          {cartCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-gray-100 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

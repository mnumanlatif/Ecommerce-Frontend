import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(null);

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
            withCredentials: true,
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

  useEffect(() => {
  document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
}, [i18n.language]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 shadow-md flex items-center justify-between">
      <Link to="/products" className="text-2xl font-bold tracking-wide hover:underline">
        🛒 {t('catalog')}
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/cart" className="flex items-center relative hover:text-gray-200">
          <ShoppingCart className="w-5 h-5" />
          <span className="ml-1">{t('cart')}</span>
          {cartCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

<label className="flex items-center space-x-2 text-white">
  <span className="text-sm hidden sm:inline">🌐</span>
  <select
    onChange={(e) => changeLanguage(e.target.value)}
    className="bg-white text-indigo-600 px-2 py-1 rounded-md"
    defaultValue={i18n.language}
  >
    <option value="en">English</option>
    <option value="ur">اردو</option>
    <option value="es">Español</option>
  </select>
</label>


        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-1 rounded-md hover:bg-gray-100 transition"
          >
            {t('logout')}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

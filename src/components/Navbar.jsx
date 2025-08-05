/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect} from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, PackageSearch } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';  // <-- import cart context
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // const [setCartCount] = useState(0);
 const { cartCount } = useCart();  // <-- use cartCount from context
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

        // const cartItems = res.data.items || [];
        // setCartCount(cartItems.length);
      } catch (err) {
        console.error('Failed to fetch cart count:', err.message);
        // setCartCount(0);
      }
    };

    fetchCartQuantity();
  }, [user]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error(t('Logout failed'));
      console.error('Logout error:', error);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-slate-900 bg-opacity-95 backdrop-blur-sm shadow-md px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 text-white">
  <Link to="/products" className="text-3xl font-bold tracking-wider text-white hover:text-violet-300 transition duration-300">
    🛒 {t('catalog')}
  </Link>

  <div className="flex items-center gap-x-6">
    <Link
      to="/products"
      className="flex items-center gap-2 hover:text-violet-300 transition duration-300"
    >
      <PackageSearch className="w-5 h-5" />
      <span className="font-medium text-lg">{t('Products')}</span>
    </Link>

    <Link
      to="/cart"
      className="relative flex items-center gap-2 hover:text-violet-300 transition duration-300"
      aria-label="View cart"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="font-medium text-lg">{t('cart')}</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-violet-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
          {cartCount}
        </span>
      )}
    </Link>

    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18n.language}
      className="bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-inner border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
    >
      <option value="en">English</option>
      <option value="ur">اردو</option>
      <option value="es">Español</option>
    </select>

    {user ? (
      <button
        onClick={handleLogout}
        className="bg-violet-700 hover:bg-violet-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105"
      >
        {t('logout')}
      </button>
    ) : (
      <Link
        to="/login"
        className="bg-violet-700 hover:bg-violet-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105"
      >
        {t('login')}
      </Link>
    )}
  </div>
</nav>

  );
};

export default Navbar;

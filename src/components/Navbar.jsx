import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, PackageSearch, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    // Commented out direction change, enable if needed
    // document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
    setLang(i18n.language);
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

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-900 to-slate-900 bg-opacity-95 backdrop-blur-sm shadow-md px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 text-white">
        <div className="flex items-center gap-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white focus:outline-none"
            aria-label={t('Open menu')}
          >
            <Menu className="w-7 h-7" />
          </button>

          <Link
            to="/products"
            className="text-3xl font-bold tracking-wider text-white hover:text-violet-300 transition duration-300"
          >
            🛒 {t('catalog')}
          </Link>
        </div>

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
            aria-label={t('View cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium text-lg">{t('cart')}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-violet-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Language toggle button */}
          <button
            onClick={toggleLanguage}
            aria-label={t('Toggle language')}
            className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-full shadow-inner border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300 select-none"
          >
            <span className={`mr-2 cursor-pointer ${lang === 'en' ? 'font-bold' : 'opacity-60'}`}>
              English
            </span>
            <div
              className={`w-10 h-6 rounded-full relative cursor-pointer bg-violet-600 transition-all duration-300 ${
                lang === 'ur' ? 'bg-violet-700' : 'bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  lang === 'ur' ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <span className={`ml-2 cursor-pointer ${lang === 'ur' ? 'font-bold' : 'opacity-60'}`}>
              اردو
            </span>
          </button>

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

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;

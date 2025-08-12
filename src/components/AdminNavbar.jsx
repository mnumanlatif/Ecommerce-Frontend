import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';

const AdminNavbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setMobileMenuOpen(false);
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
      <nav className="bg-gradient-to-r from-indigo-900 to-slate-900 bg-opacity-95 backdrop-blur-sm shadow-md px-4 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50 text-white flex-wrap">
        {/* Left: Sidebar toggle + logo */}
        <div className="flex items-center gap-x-4">
          {/* <button
            onClick={() => setSidebarOpen(true)}
            className="text-white focus:outline-none"
            aria-label={t('Open menu')}
          >
            <Menu className="w-7 h-7" />
          </button> */}

          <Link
            to="/admin"
            className="text-2xl md:text-3xl font-bold tracking-wider text-white hover:text-violet-300 transition duration-300"
          >
            🛠️ {t('catalog')}
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-x-6">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={t('Toggle language')}
            className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-full shadow-inner border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300 select-none"
          >
            <span className={`mr-2 cursor-pointer ${lang === 'en' ? 'font-bold' : 'opacity-60'}`}>
              English
            </span>
            <div
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
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

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-x-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('Close menu') : t('Open menu')}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="bg-indigo-900 bg-opacity-95 backdrop-blur-sm shadow-md px-6 py-4 flex flex-col gap-4 md:hidden text-white sticky top-16 z-40">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            aria-label={t('Toggle language')}
            className="flex items-center bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-full shadow-inner border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300 select-none"
          >
            <span className={`mr-2 cursor-pointer ${lang === 'en' ? 'font-bold' : 'opacity-60'}`}>
              English
            </span>
            <div
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
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
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default AdminNavbar;

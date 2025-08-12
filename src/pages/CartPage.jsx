/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';

const DEFAULT_IMAGE = 'https://via.placeholder.com/300';

// Normalize product name into several variants for translation key lookup
const normalizeCandidates = (raw = '') => {
  const s = String(raw).trim();
  if (!s) return [];
  const words = s.split(/\s+/);
  const camel = words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');
  const noSpaces = s.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
  const lowerNoSpaces = noSpaces.toLowerCase();
  const capitalizedNoSpaces = noSpaces.charAt(0).toUpperCase() + noSpaces.slice(1);
  return [s, camel, noSpaces, lowerNoSpaces, capitalizedNoSpaces];
};

// Attempt to find translation key for a product
const findTranslationKey = (i18n, product) => {
  if (product?.translationKey && i18n.exists(`productsList.${product.translationKey}.name`)) {
    return product.translationKey;
  }
  if (product?.slug && i18n.exists(`productsList.${product.slug}.name`)) {
    return product.slug;
  }
  const name = product?.name;
  if (name) {
    const candidates = normalizeCandidates(name);
    for (const c of candidates) {
      if (i18n.exists(`productsList.${c}.name`)) return c;
    }
    const cap = name.charAt(0).toUpperCase() + name.slice(1);
    if (i18n.exists(`productsList.${cap}.name`)) return cap;
  }
  return null;
};

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const { t, i18n } = useTranslation();

  // Set document direction based on language (RTL for Urdu, etc.)
  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch {
      toast.error(t('errors.removeItemFailed'));
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(productId, quantity);
    } catch {
      toast.error(t('errors.updateQuantityFailed'));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart, total } });
  };

  return (
    <section className="min-h-screen bg-white text-gray-800 py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow">
            🛒 {t('cart.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('cart.subtitle')}</p>
          <div className="mt-4 w-20 h-1 bg-blue-600 rounded-full mx-auto shadow-md"></div>
        </header>

        {loading ? (
          <p className="text-center text-blue-500 text-xl animate-pulse">
            {t('cart.loading')}
          </p>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">{t('cart.empty')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Items */}
            <div className="md:col-span-2 space-y-8">
              {cart.map((item, i) => {
                const translationKey = findTranslationKey(i18n, item);
                const name = translationKey
                  ? t(`productsList.${translationKey}.name`)
                  : item?.name || t('noTitle');
                const description =
                  translationKey && i18n.exists(`productsList.${translationKey}.description`)
                    ? t(`productsList.${translationKey}.description`)
                    : item?.description || t('noDescription');

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex gap-6 items-center transition-transform duration-300 hover:scale-[1.01]"
                    style={{
                      animation: `fadeInUp 0.5s ease forwards`,
                      animationDelay: `${i * 0.1}s`,
                      willChange: 'transform, box-shadow',
                    }}
                  >
                    <img
                      src={item.imageUrl || DEFAULT_IMAGE}
                      alt={name}
                      className="w-28 h-28 rounded-xl object-cover border border-blue-300"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                        {description}
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center bg-gray-100 px-4 py-1 rounded-full">
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          className="text-blue-600 text-xl px-2 hover:text-blue-500"
                        >
                          −
                        </button>
                        <span className="mx-2 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          className="text-blue-600 text-xl px-2 hover:text-blue-500"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">
                  {t('cart.summary')}
                </h2>
                <div className="space-y-3">
                  {cart.map((item) => {
                    const translationKey = findTranslationKey(i18n, item);
                    const name = translationKey
                      ? t(`productsList.${translationKey}.name`)
                      : item?.name || t('noTitle');
                    return (
                      <div key={item.productId} className="flex justify-between text-gray-700">
                        <span>
                          {name} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 border-t border-blue-200 pt-4">
                <p className="text-xl font-bold text-blue-600 mb-4">
                  {t('cart.total')}: ${total.toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow hover:shadow-md transition duration-300"
                >
                  {t('cart.proceed')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default CartPage;

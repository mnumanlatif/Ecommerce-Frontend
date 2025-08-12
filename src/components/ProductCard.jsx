import React from 'react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const DEFAULT_IMAGE = 'https://via.placeholder.com/300';

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

const findTranslationKey = (i18n, product) => {
  // 1) explicit translationKey (best practice)
  if (product?.translationKey && i18n.exists(`productsList.${product.translationKey}.name`)) {
    return product.translationKey;
  }

  // 2) slug (common)
  if (product?.slug && i18n.exists(`productsList.${product.slug}.name`)) {
    return product.slug;
  }

  // 3) try many normalized variants of product.title
  const title = product?.title;
  if (title) {
    const candidates = normalizeCandidates(title);
    for (const c of candidates) {
      if (i18n.exists(`productsList.${c}.name`)) return c;
    }
    // also try raw title but with first-letter capital (in case your JSON keys use that)
    const cap = title.charAt(0).toUpperCase() + title.slice(1);
    if (i18n.exists(`productsList.${cap}.name`)) return cap;
  }

  // not found
  return null;
};

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const translationKey = findTranslationKey(i18n, product);

  // Use translated title if available, otherwise fallback to product.title or generic label
  const title = translationKey ? t(`productsList.${translationKey}.name`) : (product?.title || t('noTitle'));

  // Use translated description if available, otherwise fallback
  const description = translationKey && i18n.exists(`productsList.${translationKey}.description`)
    ? t(`productsList.${translationKey}.description`)
    : (product?.description || t('noDescription'));

  const priceText = product?.price != null ? `$${Number(product.price).toFixed(2)}` : '$0.00';

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.info(t('pleaseLoginToAdd'));
      return;
    }

    try {
      await addToCart(product);
      toast.success(t('itemAddedToCart'));
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error(t('errorAddingToCart'));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full flex flex-col items-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
      <div className="w-full h-64 rounded-xl overflow-hidden mb-5 border border-gray-200">
        <img
          src={product?.imageUrl || DEFAULT_IMAGE}
          alt={title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 line-clamp-2">
        {title}
      </h3>

      <p className="text-gray-500 mb-4 text-center text-sm line-clamp-3 px-2">
        {description}
      </p>

      <p className="text-lg font-bold text-gray-700 mb-5">
        {priceText}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow hover:shadow-md transition duration-300"
        aria-label={`${t('addToCart')} ${title}`}
      >
        {t('addToCart')}
      </button>
    </div>
  );
};

export default ProductCard;

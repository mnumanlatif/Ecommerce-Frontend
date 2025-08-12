import React, { useState, useEffect } from 'react';
import useProducts from '../hooks/useProducts.jsx';
import ProductCard from './ProductCard';
import WhatsappButton from './WhatsappButton';
import CameraButton from './CameraButton';
import { toast } from 'react-toastify';
import ChatbotWidget from './ChatbotWidget';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ProductList = () => {
  const { products: defaultProducts, loading: defaultLoading, error } = useProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(defaultLoading);
  const [searchMode, setSearchMode] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (error) toast.error(`${t('Error')}: ${error?.message || error}`);
  }, [error, t]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    if (!searchMode) setProducts(defaultProducts);
    setLoading(defaultLoading);
  }, [defaultProducts, defaultLoading, searchMode]);

  const handleImageSelected = async (file) => {
    setLoading(true);
    setSearchMode(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        'http://localhost:7002/api/image-search',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const matchedProducts = response.data;
      if (matchedProducts.length === 0) {
        toast.info(t('No matching products found.'));
      }
      setProducts(matchedProducts);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t('Failed to search products by image.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WhatsappButton />
      <CameraButton onImageSelected={handleImageSelected} />

      <section className="min-h-screen bg-white text-gray-800 px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-gray-900">
              {searchMode ? t('searchResults') : `🔥 ${t('hotProductsTitle')}`}
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              {searchMode ? t('searchResultsSubtitle') : t('hotProductsSubtitle')}
            </p>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-6 rounded-full" />
          </div>

          {loading && (
            <p role="status" className="text-center text-indigo-500 text-xl animate-pulse">
              {t('loadingProducts')}
            </p>
          )}

          {!loading && products?.length === 0 && (
            <p role="status" className="text-center italic text-gray-400">
              {t('noProductsAvailable')}
            </p>
          )}

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products?.map((product, i) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 p-5 rounded-2xl shadow hover:shadow-lg 
                transform transition duration-300 hover:scale-[1.03]"
                style={{
                  animation: `fadeInUp 0.5s ease forwards`,
                  animationDelay: `${i * 0.12}s`,
                  willChange: 'transform, opacity',
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
      <ChatbotWidget />
    </>
  );
};

export default ProductList;

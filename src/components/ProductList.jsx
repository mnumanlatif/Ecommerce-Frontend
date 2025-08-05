import React from 'react';
import useProducts from '../hooks/useProducts.jsx';
import ProductCard from './ProductCard';
import WhatsappButton from './WhatsappButton';
import { toast } from 'react-toastify';

const ProductList = () => {
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <>
      <WhatsappButton />
      <section className="min-h-screen bg-gray-900 text-gray-200 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              🔥 Hot Products Just For You
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-lg text-gray-400">
              Discover our exclusive selection of top-rated products. Quality meets style!
            </p>
            <div className="mt-6 mx-auto w-20 h-1 rounded-full bg-indigo-500 shadow-lg"></div>
          </header>

          {/* Content */}
          {loading && (
            <p className="text-center text-indigo-400 text-xl animate-pulse">
              Loading products...
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-center italic text-gray-500">No products available.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {products.map((product, i) => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-3xl p-6 shadow-lg shadow-indigo-700/30 hover:shadow-indigo-700/60
                           transform transition duration-400 hover:scale-[1.05] cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease forwards`,
                  animationDelay: `${i * 0.12}s`,
                  willChange: 'transform, box-shadow',
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Custom fadeInUp animation */}
        <style>{`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default ProductList;

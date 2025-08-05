import React from 'react';
import useProducts from '../hooks/useProducts.jsx';
import ProductCard from './ProductCard';
import WhatsappButton from './WhatsappButton';
import { toast } from 'react-toastify';

const ProductList = () => {
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  return (
    <>
      <WhatsappButton />
      <section className="min-h-screen bg-white text-gray-800 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-gray-900">
              🔥 Hot Products Just For You
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Discover top-rated picks curated for your comfort and style.
            </p>
            <div className="w-16 h-1 bg-indigo-500 mx-auto mt-6 rounded-full" />
          </div>

          {/* Loading/Error States */}
          {loading && (
            <p className="text-center text-indigo-500 text-xl animate-pulse">
              Loading products...
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="text-center italic text-gray-400">No products available.</p>
          )}

          {/* Product Grid */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
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

        {/* Animation */}
        <style>{`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
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

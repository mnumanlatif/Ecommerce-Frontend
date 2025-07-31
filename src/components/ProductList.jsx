import React from 'react';
import useProducts from '../hooks/useProducts.jsx';
import ProductCard from './ProductCard';
// import Navbar from './Navbar';
import WhatsappButton from './WhatsappButton';
const ProductList = () => {
  const { products, loading, error } = useProducts();

  return (
    <>
      {/* <Navbar /> */}
        <WhatsappButton />
      <div className="p-8">
        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="text-center">No products available.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;

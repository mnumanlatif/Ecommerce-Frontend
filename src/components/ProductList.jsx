import React from 'react';
import useProducts from '../hooks/useProducts.jsx';
import ProductCard from './ProductCard';
import WhatsappButton from './WhatsappButton';
import { toast } from 'react-toastify';

const ProductList = () => {
  const { products, loading, error } = useProducts();

  // Show toast notification if error occurs
  React.useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  return (
    <>
      <WhatsappButton />
      <div className="p-8">
        {loading && <p className="text-center">Loading products...</p>}
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

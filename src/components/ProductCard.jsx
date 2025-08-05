import React from 'react';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DEFAULT_IMAGE = 'https://via.placeholder.com/300';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.info('Please login to add items to your cart.');
      return;
    }

    try {
      await addToCart(product);
      toast.success('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Something went wrong while adding to cart.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full flex flex-col items-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
      <div className="w-full h-64 rounded-xl overflow-hidden mb-5 border border-gray-200">
        <img
          src={product?.imageUrl || DEFAULT_IMAGE}
          alt={product?.title || 'Product Image'}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 line-clamp-2">
        {product?.title || 'No Title'}
      </h3>

      <p className="text-gray-500 mb-4 text-center text-sm line-clamp-3 px-2">
        {product?.description || 'No description available.'}
      </p>

      <p className="text-lg font-bold text-gray-700 mb-5">
        ${product?.price?.toFixed(2) || '0.00'}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow hover:shadow-md transition duration-300"
        aria-label={`Add ${product?.title || 'product'} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

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
    <div className="bg-gray-800 rounded-3xl shadow-indigo-700/40 shadow-lg max-w-sm w-full flex flex-col items-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-indigo-700/70 cursor-pointer">
      <div className="w-full h-64 rounded-xl overflow-hidden mb-5 border border-indigo-600">
        <img
          src={product?.imageUrl || DEFAULT_IMAGE}
          alt={product?.title || 'Product Image'}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      <h3 className="text-2xl font-bold text-center text-indigo-300 mb-3 line-clamp-2">
        {product?.title || 'No Title'}
      </h3>

      <p className="text-indigo-400 mb-5 text-center text-sm line-clamp-3 px-2">
        {product?.description || 'No description available.'}
      </p>

      <p className="text-xl font-extrabold text-indigo-500 mb-6">
        ${product?.price?.toFixed(2) || '0.00'}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-3 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
        aria-label={`Add ${product?.title || 'product'} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

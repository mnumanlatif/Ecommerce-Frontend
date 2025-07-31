import React from 'react';
import { addToCart as sendToCartAPI } from '../services/cartApi';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart: updateCartContext } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user?._id) {
      alert('Please login to add items to your cart.');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.title || product.name || 'Unnamed',
      price: product.price || 0,
      imageUrl: product.imageUrl || '',
      quantity: 1,
    };

    const cartPayload = {
      userId: user._id,
      items: [cartItem],
    };

    try {
      console.log('Sending cart data:', cartPayload);
      await sendToCartAPI(cartPayload);           // API call
      updateCartContext(cartItem);                // Update context
      alert('Item added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Something went wrong while adding to cart.');
    }
  };

  return (
    <div className="border rounded-2xl p-4 w-full max-w-sm shadow-xl bg-white flex flex-col items-center hover:shadow-2xl transition">
      <div className="w-full h-56 overflow-hidden rounded-lg mb-4">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.title || 'Product Image'}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2 text-center line-clamp-2">
        {product.title || 'No Title'}
      </h3>
      <p className="text-gray-600 mb-3 text-sm text-center line-clamp-3">
        {product.description || 'No description available.'}
      </p>
      <p className="text-lg font-bold text-blue-600">
        ${product.price?.toFixed(2) || '0.00'}
      </p>

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

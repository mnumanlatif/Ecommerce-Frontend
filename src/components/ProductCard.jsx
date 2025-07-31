import React from 'react';
import { addToCart } from '../services/cartApi';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart: addToFrontendCart } = useCart();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user || !user._id) {
      alert('You must be logged in to add to cart');
      return;
    }

    const cartData = {
      userId: user._id,
      items: [
        {
          productId: product._id,
          name: product.title || product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ],
    };

    try {
      console.log('Sending cart data:', cartData);
      await addToCart(cartData);
      addToFrontendCart({
        productId: product._id,
        name: product.title || product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      });
      alert('Item added to cart!');
      navigate('/cart'); // <-- navigate after add success
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="border rounded-2xl p-4 w-full max-w-sm shadow-xl bg-white flex flex-col items-center hover:shadow-2xl transition">
      <div className="w-full h-56 overflow-hidden rounded-lg mb-4">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2 text-center">{product.title}</h3>
      <p className="text-gray-600 mb-3 text-sm text-center line-clamp-3">{product.description}</p>
      <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>

      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

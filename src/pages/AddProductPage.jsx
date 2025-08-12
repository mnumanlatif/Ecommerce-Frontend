import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddProductPage() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5002/api/products', product);
      toast.success('Product added successfully!');
      setProduct({ title: '', description: '', price: '', imageUrl: '' });
      setTimeout(() => navigate('/'), 2000); // redirect after delay
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center p-8">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white shadow-lg rounded-3xl p-10 space-y-8
                 border border-blue-300
                 hover:shadow-blue-400/50
                 transition-shadow duration-500"
    >
      <h2 className="text-3xl font-extrabold text-center text-blue-700 tracking-wide">
        Add New Product
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Product Title"
        value={product.title}
        onChange={handleChange}
        required
        className="w-full p-4 border border-blue-300 rounded-xl
                   focus:outline-none focus:ring-4 focus:ring-blue-300
                   placeholder-blue-400
                   transition duration-300"
      />

      <textarea
        name="description"
        placeholder="Product Description"
        value={product.description}
        onChange={handleChange}
        required
        rows="5"
        className="w-full p-4 border border-blue-300 rounded-xl
                   focus:outline-none focus:ring-4 focus:ring-blue-300
                   placeholder-blue-400 resize-none
                   transition duration-300"
      ></textarea>

      <input
        type="number"
        name="price"
        placeholder="Price (e.g. 99.99)"
        value={product.price}
        onChange={handleChange}
        required
        step="0.01"
        className="w-full p-4 border border-blue-300 rounded-xl
                   focus:outline-none focus:ring-4 focus:ring-blue-300
                   placeholder-blue-400
                   transition duration-300"
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={product.imageUrl}
        onChange={handleChange}
        required
        className="w-full p-4 border border-blue-300 rounded-xl
                   focus:outline-none focus:ring-4 focus:ring-blue-300
                   placeholder-blue-400
                   transition duration-300"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold text-white shadow-md
                   transition duration-300
                   ${
                     loading
                       ? 'bg-blue-400 cursor-not-allowed shadow-none'
                       : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40 hover:shadow-lg'
                   }`}
      >
        {loading ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  </div>
);
}

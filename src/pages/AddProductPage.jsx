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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-green-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-xl p-8 rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Add New Product</h2>

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={product.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        ></textarea>

        <input
          type="number"
          name="price"
          placeholder="Price (e.g. 99.99)"
          value={product.price}
          onChange={handleChange}
          required
          step="0.01"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-3 rounded-lg transition ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

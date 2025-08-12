/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Fetch existing product details on mount
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/products/${id}`);
        setProduct({
          title: res.data.title || '',
          description: res.data.description || '',
          price: res.data.price || '',
          imageUrl: res.data.imageUrl || ''
        });
      } catch (error) {
        toast.error('Failed to load product data');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5002/api/products/${id}`, product);
      toast.success('Product updated successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading product data...
      </div>
    );
  }

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
          Edit Product
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
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}

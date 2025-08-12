/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5002/api/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5002/api/products/${id}`);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="sticky top-4 z-30 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-md flex justify-between items-center px-6 py-4 mb-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Admin Dashboard</h1>
        <button
          onClick={() => navigate('/admin/add-product')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
          aria-label="Add Product"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </header>

      {loading ? (
        <p className="text-center text-gray-500 text-lg mt-20">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">No products found.</p>
      ) : (
        <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(({ _id, title, description, price, imageUrl }) => (
            <article
              key={_id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <img
                src={imageUrl}
                alt={title}
                className="h-48 w-full object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{title}</h2>
                <p className="text-gray-600 text-sm flex-grow line-clamp-4">
                  {description.length > 120 ? description.slice(0, 120) + '...' : description}
                </p>
                <div className="mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <span className="text-lg font-bold text-indigo-600">${price.toFixed(2)}</span>
                  <div className="flex gap-4 justify-center sm:justify-end flex-wrap">
                    <button
                      onClick={() => handleEdit(_id)}
                      title={`Edit ${title}`}
                      className="flex justify-center items-center p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform transform hover:scale-110 sm:p-3 sm:w-10 sm:h-10"
                      aria-label={`Edit ${title}`}
                    >
                      <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button
                      onClick={() => handleDelete(_id)}
                      title={`Delete ${title}`}
                      className="flex justify-center items-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform transform hover:scale-110 sm:p-3 sm:w-10 sm:h-10"
                      aria-label={`Delete ${title}`}
                    >
                      <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';

const categories = [
  {
    name: 'Electronics',
    icon: '📱',
    subcategories: ['Mobiles', 'Laptops', 'Cameras'],
  },
  {
    name: 'Fashion',
    icon: '👗',
    subcategories: ['Men', 'Women', 'Accessories'],
  },
  {
    name: 'Home',
    icon: '🏠',
    subcategories: ['Furniture', 'Decor', 'Kitchen'],
  },
  {
    name: 'Sports',
    icon: '🏀',
    subcategories: ['Fitness', 'Outdoor', 'Indoor Games'],
  },
  {
    name: 'Books',
    icon: '📚',
    subcategories: ['Fiction', 'Non-Fiction', 'Academic'],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (name) => {
    setOpenCategory((prev) => (prev === name ? null : name));
  };

  return (
    <>
      {/* Blurry Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white text-gray-800 shadow-lg transform z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Browse Categories</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500" aria-label="Close sidebar">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category List */}
        <div className="p-4 space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-200"
            >
              <div
                className="flex justify-between items-center cursor-pointer py-3 px-4 hover:bg-gray-50 rounded-t-lg"
                onClick={() => toggleCategory(cat.name)}
              >
                <span className="flex items-center gap-2 font-medium text-gray-900 select-none">
                  <span>{cat.icon}</span> {cat.name}
                </span>
                {openCategory === cat.name ? (
                  <Minus className="w-4 h-4 text-gray-500" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Subcategories */}
              {openCategory === cat.name && (
                <div className="bg-gray-50 px-4 py-3 rounded-b-lg transition-all duration-200 ease-in-out space-y-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      to={`/category/${sub.toLowerCase()}`}
                      onClick={onClose}
                      className="block text-[15px] text-gray-700 px-3 py-2 rounded-md hover:bg-violet-100 hover:text-violet-700 transition-all"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

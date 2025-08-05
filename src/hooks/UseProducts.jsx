import { useState, useEffect } from 'react';
import productService from '../services/productApi';
import { toast } from 'react-toastify';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        const errMsg = err.message || 'Unknown error';
        setError(errMsg);
        toast.error(`Failed to load products: ${errMsg}`);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AddProductPage from './pages/AddProductPage'; // ✅ Admin Page
import Navbar from './components/Navbar';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const isAdmin = user?.role === 'admin'; // ✅ Correct role check

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to={isAdmin ? "/admin/add-product" : "/products"} replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/products" replace />} />

        {/* User Routes */}
        {user && (
          <>
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </>
        )}

        {/* Admin Routes */}
        {user && isAdmin && (
          <Route path="/admin/add-product" element={<AddProductPage />} />
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? (isAdmin ? "/admin/add-product" : "/products") : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

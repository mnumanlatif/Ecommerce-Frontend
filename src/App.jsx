
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import Navbar from './components/Navbar';
// import CartSidebar from './components/CartSidebar';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <BrowserRouter>
      {user && <Navbar />}
      {/* {user && <CartSidebar />} */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!user ? <LoginPage /> : <Navigate to="/products" replace />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/products" replace />}
        />

        {/* Protected Routes */}
        <Route
          path="/products"
          element={user ? <ProductList /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/" replace />}
        />

        {/* Catch-all fallback route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/products" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

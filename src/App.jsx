import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboardPage'; // Your dashboard page
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';

const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ user, isAdmin, children }) => {
  if (!user) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/products" replace />;
  return children;
};

export default function App() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Force LTR direction
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');

    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        direction: ltr !important;
        unicode-bidi: embed !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <BrowserRouter>
      {/* Conditionally render Navbar based on role */}
      {user && (isAdmin ? <AdminNavbar /> : <Navbar />)}
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <LoginPage />
            ) : (
              <Navigate to={isAdmin ? '/admin' : '/products'} replace />
            )
          }
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/products" replace />}
        />

        {/* User Routes */}
        <Route
          path="/products"
          element={
            <ProtectedRoute user={user}>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute user={user}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute user={user}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute user={user} isAdmin={isAdmin}>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute user={user} isAdmin={isAdmin}>
              <AddProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute user={user} isAdmin={isAdmin}>
              <EditProductPage />
            </AdminRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <Navigate
              to={user ? (isAdmin ? '/admin' : '/products') : '/'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

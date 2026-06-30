// /client/src/pages/CheckoutGuard.jsx
// AC-CHK-02: redirect to /login if not authenticated
// AC-CHK-03: redirect to /cart if cart is empty
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../store/authSlice';
import { selectCartItemCount } from '../store/cartSlice';

export default function CheckoutGuard({ children }) {
  const token = useSelector(selectAuthToken);
  const cartCount = useSelector(selectCartItemCount);

  if (!token) {
    return <Navigate to="/login" state={{ message: 'Please log in to checkout' }} replace />;
  }
  if (cartCount === 0) {
    return <Navigate to="/cart" state={{ message: 'Your cart is empty' }} replace />;
  }
  return children;
}

// /client/src/pages/CheckoutGuard.jsx
// AC-CART-12: redirect to /cart if cart is empty when accessing /checkout
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../store/cartSlice';

export default function CheckoutGuard({ children }) {
  const count = useSelector(selectCartItemCount);
  if (count === 0) {
    return <Navigate to="/cart" replace />;
  }
  return children;
}

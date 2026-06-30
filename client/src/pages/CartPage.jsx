// /client/src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchCart,
  clearCartAsync,
  selectCartItems,
  selectCartItemCount,
  selectCartTotalPrice,
  selectCartLoading,
  selectCartError,
} from '../store/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemCount);
  const totalPrice = useSelector(selectCartTotalPrice);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClearCart = () => {
    dispatch(clearCartAsync());
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // AC-CART-07: Empty cart state
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Shopping Cart
            <span className="ml-2 text-base font-normal text-gray-500">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition"
          >
            Clear Cart
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AC-CART-04: Cart items list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                />
              ))}
            </div>
          </div>

          {/* AC-CART-08: Order summary + AC-CART-11: Proceed to checkout */}
          <div className="lg:col-span-1">
            <CartSummary totalPrice={totalPrice} itemCount={totalItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

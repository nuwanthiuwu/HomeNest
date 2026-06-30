// /client/src/components/cart/CartSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TAX_RATE = 0.1; // 10%

export default function CartSummary({ totalPrice, itemCount }) {
  const navigate = useNavigate();
  const tax = totalPrice * TAX_RATE;
  const orderTotal = totalPrice + tax;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-base font-bold text-gray-900">
        <span>Order Total</span>
        <span className="text-blue-600">${orderTotal.toFixed(2)}</span>
      </div>

      {/* AC-CART-11: Proceed to Checkout */}
      <button
        onClick={() => navigate('/checkout')}
        disabled={itemCount === 0}
        className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>

      <button
        onClick={() => navigate('/products')}
        className="mt-3 w-full border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
}

// /client/src/components/checkout/OrderReview.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotalPrice } from '../../store/cartSlice';
import { selectDiscount } from '../../store/checkoutSlice';
import CouponInput from './CouponInput';

const TAX_RATE = 0.1;

export default function OrderReview({ onBack, onNext }) {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotalPrice);
  const discount = useSelector(selectDiscount);
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  return (
    <div className="space-y-5">
      {/* Items list */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3 py-3">
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
              <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon input */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Have a coupon?</p>
        <CouponInput />
      </div>

      {/* Totals — AC-CHK-06 */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
          <span>Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

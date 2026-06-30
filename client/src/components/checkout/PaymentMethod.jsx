// /client/src/components/checkout/PaymentMethod.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPaymentMethod,
  selectPaymentMethod,
  selectCheckoutLoading,
  selectCheckoutError,
  selectDiscount,
} from '../../store/checkoutSlice';
import { selectCartTotalPrice } from '../../store/cartSlice';

const TAX_RATE = 0.1;

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export default function PaymentMethod({ onBack, onPlaceOrder }) {
  const dispatch = useDispatch();
  const selected = useSelector(selectPaymentMethod);
  const loading = useSelector(selectCheckoutLoading);
  const error = useSelector(selectCheckoutError);
  const subtotal = useSelector(selectCartTotalPrice);
  const discount = useSelector(selectDiscount);
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  return (
    <div className="space-y-5">
      {/* AC-CHK-09: at least two payment methods, one pre-selected */}
      <div className="space-y-3">
        {METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
              selected === method.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selected === method.id}
              onChange={() => dispatch(setPaymentMethod(method.id))}
              className="accent-blue-600"
            />
            <span className="text-xl">{method.icon}</span>
            <span className="font-medium text-gray-800">{method.label}</span>
          </label>
        ))}
      </div>

      {/* Order total summary */}
      <div className="bg-blue-50 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-600">Order Total</span>
        <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : '✓ Place Order'}
        </button>
      </div>
    </div>
  );
}

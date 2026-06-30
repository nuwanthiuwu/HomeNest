// /client/src/components/checkout/CouponInput.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  validateCoupon,
  clearCoupon,
  setCouponCode,
  selectCouponCode,
  selectDiscount,
  selectCouponApplied,
  selectCouponError,
  selectCheckoutLoading,
} from '../../store/checkoutSlice';
import { selectCartTotalPrice } from '../../store/cartSlice';

export default function CouponInput() {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const couponCode = useSelector(selectCouponCode);
  const discount = useSelector(selectDiscount);
  const couponApplied = useSelector(selectCouponApplied);
  const couponError = useSelector(selectCouponError);
  const loading = useSelector(selectCheckoutLoading);
  const subtotal = useSelector(selectCartTotalPrice);

  const handleApply = () => {
    if (!input.trim()) return;
    dispatch(setCouponCode(input.trim().toUpperCase()));
    dispatch(validateCoupon({ couponCode: input.trim().toUpperCase(), subtotal }));
  };

  const handleRemove = () => {
    setInput('');
    dispatch(clearCoupon());
  };

  if (couponApplied) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-green-700">Coupon applied: {couponCode}</p>
          <p className="text-xs text-green-600">You save ${discount.toFixed(2)}</p>
        </div>
        <button onClick={handleRemove} className="text-xs text-red-500 hover:underline">
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {couponError && (
        <p className="text-xs text-red-500">{couponError}</p>
      )}
      <p className="text-xs text-gray-400">Try: SAVE10, SAVE20, WELCOME</p>
    </div>
  );
}

// /client/src/components/product/QuantitySelector.jsx
import React from 'react';

export default function QuantitySelector({ value, min = 1, max, onChange }) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  const decrement = () => {
    if (!atMin) onChange(value - 1);
  };

  const increment = () => {
    if (!atMax) onChange(value + 1);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <button
          onClick={decrement}
          disabled={atMin}
          aria-label="Decrease quantity"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-xl font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          −
        </button>

        <span className="w-10 text-center text-lg font-semibold text-gray-800">{value}</span>

        <button
          onClick={increment}
          disabled={atMax}
          aria-label="Increase quantity"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-xl font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          +
        </button>
      </div>

      {atMax && (
        <p className="text-sm text-amber-600 font-medium">Maximum available quantity reached</p>
      )}
    </div>
  );
}

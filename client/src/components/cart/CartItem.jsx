// /client/src/components/cart/CartItem.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateItem, removeItem } from '../../store/cartSlice';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const { product, quantity, price } = item;
  const lineTotal = (price * quantity).toFixed(2);

  const handleQtyChange = (newQty) => {
    if (newQty < 1) return;
    if (newQty > product.stock) return;
    dispatch(updateItem({ productId: product._id, quantity: newQty }));
  };

  const handleRemove = () => {
    dispatch(removeItem(product._id));
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Product image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
        )}
      </div>

      {/* Name + price */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{product.name}</p>
        <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-amber-600 mt-0.5">Only {product.stock} left</p>
        )}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => handleQtyChange(quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-8 text-center font-medium text-gray-800">{quantity}</span>
        <button
          onClick={() => handleQtyChange(quantity + 1)}
          disabled={quantity >= product.stock}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="w-20 text-right flex-shrink-0">
        <p className="font-bold text-blue-600">${lineTotal}</p>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        aria-label="Remove item"
        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

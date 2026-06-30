// /client/src/components/common/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ id, name, price, image, rating = 0, stock }) {
  const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return (
    <Link
      to={`/products/${id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
    >
      <div className="aspect-square bg-gray-200 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600">${price.toFixed(2)}</span>
          <span className="text-sm text-yellow-600">{stars}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </p>
        <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
          Add to Cart
        </button>
      </div>
    </Link>
  );
}

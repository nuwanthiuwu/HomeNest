// /client/src/components/home/CategoryMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryMenu({ categories = [], loading }) {
  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-32 h-40 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat._id}`}
            className="flex-shrink-0 w-32 text-center group cursor-pointer"
          >
            <div className="w-32 h-32 bg-gray-200 rounded-lg mb-2 overflow-hidden group-hover:shadow-lg transition-shadow">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">📦</div>
              )}
            </div>
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

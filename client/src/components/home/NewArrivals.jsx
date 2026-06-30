// /client/src/components/home/NewArrivals.jsx
import React from 'react';
import ProductCard from '../common/ProductCard';

export default function NewArrivals({ products = [], loading }) {
  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
              stock={product.stock}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No new arrivals yet.</p>
          <p className="text-gray-400 mt-2">We're constantly adding new products!</p>
        </div>
      )}
    </div>
  );
}

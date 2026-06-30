// /client/src/components/catalog/ProductGrid.jsx
import React from 'react';
import ProductCard from '../common/ProductCard';

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products to display</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
  );
}

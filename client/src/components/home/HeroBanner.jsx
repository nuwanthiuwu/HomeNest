// /client/src/components/home/HeroBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ imageUrl, title, subtitle, ctaText = 'Shop Now', ctaLink = '/products' }) {
  return (
    <div
      className="relative w-full h-96 bg-cover bg-center rounded-lg overflow-hidden mb-8"
      style={{ backgroundImage: `url('${imageUrl || 'https://via.placeholder.com/1200x400'}')` }}
    >
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          {title && <h1 className="text-5xl font-bold mb-4">{title}</h1>}
          {subtitle && <p className="text-xl mb-8 max-w-md">{subtitle}</p>}
          <Link
            to={ctaLink}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}

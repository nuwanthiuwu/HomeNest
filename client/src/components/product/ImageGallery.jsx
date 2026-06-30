// /client/src/components/product/ImageGallery.jsx
import React, { useState } from 'react';

export default function ImageGallery({ images = [], name = '' }) {
  const [mainIdx, setMainIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-lg">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
        <img
          src={images[mainIdx]}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setMainIdx(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === mainIdx
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={src} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

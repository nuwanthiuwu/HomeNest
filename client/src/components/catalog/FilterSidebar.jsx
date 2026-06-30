// /client/src/components/catalog/FilterSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, fetchProducts } from '../../store/productSlice';
import { selectCategories } from '../../store/homeSlice';
import { selectProductFilters } from '../../store/productSlice';

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectProductFilters);

  // Local state for UI
  const [selectedCategories, setSelectedCategories] = useState(filters.category || []);
  const [minPrice, setMinPrice] = useState(filters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 1000);
  const [inStock, setInStock] = useState(filters.inStock || false);
  const [selectedRating, setSelectedRating] = useState(filters.rating || 0);
  const [isApplying, setIsApplying] = useState(false);

  // Debounce timer for price range
  const priceDebounceRef = useRef(null);

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      return updated;
    });
  };

  // Handle in stock toggle
  const handleInStockChange = () => {
    setInStock((prev) => !prev);
  };

  // Handle price range change with debounce
  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value, 10);

    if (type === 'min') {
      setMinPrice(numValue);
    } else {
      setMaxPrice(numValue);
    }

    // Clear previous debounce
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }

    // Set new debounce timer
    priceDebounceRef.current = setTimeout(() => {
      const finalMin = type === 'min' ? numValue : minPrice;
      const finalMax = type === 'max' ? numValue : maxPrice;

      if (finalMin < finalMax && finalMin >= 0 && finalMax <= 1000) {
        dispatch(setFilter({ minPrice: finalMin, maxPrice: finalMax }));
        applyFilters({ minPrice: finalMin, maxPrice: finalMax });
      }
    }, 300);
  };

  // Handle rating selection
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  // Apply filters function
  const applyFilters = (overrides = {}) => {
    setIsApplying(true);

    const filterPayload = {
      category: overrides.category !== undefined ? overrides.category : selectedCategories,
      minPrice: overrides.minPrice !== undefined ? overrides.minPrice : minPrice,
      maxPrice: overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice,
      inStock: overrides.inStock !== undefined ? overrides.inStock : inStock,
      rating: overrides.rating !== undefined ? overrides.rating : selectedRating,
    };

    dispatch(setFilter(filterPayload));
    dispatch(fetchProducts(filterPayload)).then(() => {
      setIsApplying(false);
    });
  };

  // Apply filters when selected categories or in-stock change
  useEffect(() => {
    applyFilters({ category: selectedCategories, inStock });
  }, [selectedCategories, inStock]);

  // Apply rating filter
  const handleRatingApply = (rating) => {
    setSelectedRating(rating);
    applyFilters({ rating });
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(1000);
    setInStock(false);
    setSelectedRating(0);

    dispatch(clearFilters());
    dispatch(fetchProducts({}));
    setIsApplying(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        {isApplying && (
          <div className="animate-spin">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="space-y-2">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <label key={category._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  className="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer"
                />
                <span className="text-gray-700">{category.name}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No categories available</p>
          )}
        </div>
        {selectedCategories.length > 0 && (
          <p className="text-xs text-blue-600 mt-2">{selectedCategories.length} selected</p>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="1000"
              value={minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg accent-blue-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg accent-blue-600 cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">${minPrice}</span> — <span className="font-medium">${maxPrice}</span>
          </p>
        </div>
      </div>

      {/* In Stock Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleInStockChange}
            className="w-4 h-4 text-blue-600 rounded accent-blue-600 cursor-pointer"
          />
          <span className="text-gray-700">In stock only</span>
        </label>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleRatingApply(0)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedRating === 0
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ratings
          </button>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingApply(star)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                selectedRating === star
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{star}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < star ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-auto">&amp; up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear All Filters Button */}
      <button
        onClick={handleClearFilters}
        className="w-full px-4 py-2 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md font-medium text-sm transition-colors duration-200"
      >
        Clear All Filters
      </button>
    </div>
  );
}

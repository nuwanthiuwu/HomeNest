// /client/src/components/catalog/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts, selectProductLoading, selectProductFilters } from '../../store/productSlice';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectProductLoading);
  const filters = useSelector(selectProductFilters);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchProducts(query));
    }, 400); // 400ms debounce

    return () => clearTimeout(timer); // cleanup previous timer
  }, [query, dispatch]);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Manually trigger search immediately
      e.preventDefault();
      dispatch(searchProducts(query));
    } else if (e.key === 'Escape') {
      // Clear search and show all products
      setQuery('');
      dispatch(searchProducts(''));
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setQuery('');
    dispatch(searchProducts(''));
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xl font-bold"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 min-w-max">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-500 italic whitespace-nowrap">Searching...</span>
          </div>
        )}
        {!loading && filters.search && (
          <span className="text-sm text-gray-500 italic whitespace-nowrap">
            (Results for '{filters.search}')
          </span>
        )}
      </div>
    </div>
  );
}

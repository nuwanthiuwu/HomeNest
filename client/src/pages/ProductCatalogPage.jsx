// /client/src/pages/ProductCatalogPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectProductsData,
  selectProductLoading,
  selectProductError,
  selectProductFilters,
  selectProductPage,
} from '../store/productSlice';
import { fetchCategories, selectCategories } from '../store/homeSlice';
import { useQueryParams } from '../hooks/useQueryParams';
import FilterSidebar from '../components/catalog/FilterSidebar';
import SearchBar from '../components/catalog/SearchBar';
import ProductGrid from '../components/catalog/ProductGrid';
import Pagination from '../components/common/Pagination';

export default function ProductCatalogPage() {
  const dispatch = useDispatch();
  const { products, total, page, totalPages } = useSelector(selectProductsData);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const filters = useSelector(selectProductFilters);
  const currentPage = useSelector(selectProductPage);
  const categories = useSelector(selectCategories);

  // Sync filters with URL query params
  useQueryParams();

  // Fetch categories on mount
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  // Fetch products on mount or when filters/page changes
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: currentPage, limit: 12 }));
  }, [dispatch, filters, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Products</h1>
          <SearchBar />
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <FilterSidebar />
          </aside>

          {/* Product grid */}
          <main className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <span className="text-gray-500">Loading products...</span>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, total)} of {total} products
                </div>
                <ProductGrid products={products} />
                {totalPages > 1 && (
                  <Pagination currentPage={page} totalPages={totalPages} />
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg mb-4">No products found</p>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

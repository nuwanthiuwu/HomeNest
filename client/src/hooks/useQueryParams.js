// /client/src/hooks/useQueryParams.js
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setPage } from '../store/productSlice';

const defaultFilters = {
  category: [],
  minPrice: 0,
  maxPrice: 1000,
  inStock: false,
  rating: 0,
  sort: 'newest',
  search: '',
};

/**
 * Syncs Redux filter state with URL query parameters
 *
 * Supports bidirectional sync:
 * - On mount: reads URL params → initializes Redux state
 * - On filter change: Redux state → updates URL
 * - On back/forward: URL change → updates Redux state
 *
 * Supported query params: category, minPrice, maxPrice, inStock, rating, sort, search, page
 * Example: /products?category=id1,id2&minPrice=50&maxPrice=200&sort=price_asc&page=2
 */
export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.product.filters);
  const page = useSelector((state) => state.product.page);

  // Initialize from URL on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');
    const pageParam = searchParams.get('page');

    // Build filter object from query params
    const urlFilters = { ...defaultFilters };
    let hasFilters = false;

    if (category) {
      urlFilters.category = category.split(',').filter(Boolean);
      hasFilters = true;
    }

    if (minPrice !== null) {
      urlFilters.minPrice = parseInt(minPrice, 10);
      hasFilters = true;
    }

    if (maxPrice !== null) {
      urlFilters.maxPrice = parseInt(maxPrice, 10);
      hasFilters = true;
    }

    if (inStock !== null) {
      urlFilters.inStock = inStock === 'true';
      hasFilters = true;
    }

    if (rating !== null) {
      urlFilters.rating = parseInt(rating, 10);
      hasFilters = true;
    }

    if (sort) {
      urlFilters.sort = sort;
      hasFilters = true;
    }

    if (search) {
      urlFilters.search = search;
      hasFilters = true;
    }

    // Dispatch filters if any exist in URL
    if (hasFilters) {
      dispatch(setFilter(urlFilters));
    }

    // Set page from URL
    if (pageParam) {
      dispatch(setPage(parseInt(pageParam, 10)));
    }
  }, [searchParams, dispatch]); // Only run on mount (searchParams is stable on mount)

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    // Add category
    if (filters.category && filters.category.length > 0) {
      newParams.set('category', filters.category.join(','));
    }

    // Add price range
    if (filters.minPrice !== defaultFilters.minPrice) {
      newParams.set('minPrice', filters.minPrice);
    }

    if (filters.maxPrice !== defaultFilters.maxPrice) {
      newParams.set('maxPrice', filters.maxPrice);
    }

    // Add inStock
    if (filters.inStock !== defaultFilters.inStock) {
      newParams.set('inStock', filters.inStock);
    }

    // Add rating
    if (filters.rating !== defaultFilters.rating) {
      newParams.set('rating', filters.rating);
    }

    // Add sort
    if (filters.sort !== defaultFilters.sort) {
      newParams.set('sort', filters.sort);
    }

    // Add search
    if (filters.search !== defaultFilters.search) {
      newParams.set('search', filters.search);
    }

    // Add page
    if (page !== 1) {
      newParams.set('page', page);
    }

    setSearchParams(newParams);
  }, [filters, page, setSearchParams]);
};

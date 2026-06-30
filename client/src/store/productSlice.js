// /client/src/store/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productApi from '../api/productApi';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await productApi.getProducts(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      return await productApi.searchProducts(query);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

const defaultFilters = {
  category: [],
  minPrice: 0,
  maxPrice: 1000,
  inStock: false,
  rating: 0,
  sort: 'newest',
  search: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    total: 0,
    page: 1,
    totalPages: 1,
    filters: { ...defaultFilters },
    loading: false,
    error: null,
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = { ...defaultFilters };
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.total = action.payload.data.total;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.total = action.payload.data.total;
        state.totalPages = action.payload.data.totalPages;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilters, setPage } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export const selectProductTotal = (state) => state.product.total;
export const selectProductPage = (state) => state.product.page;
export const selectProductTotalPages = (state) => state.product.totalPages;
export const selectProductFilters = (state) => state.product.filters;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;

// Combined selector for convenience
export const selectProductsData = (state) => ({
  products: state.product.products,
  total: state.product.total,
  page: state.product.page,
  totalPages: state.product.totalPages,
});

export default productSlice.reducer;

// /client/src/store/homeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as homeApi from '../api/homeApi';

export const fetchFeaturedProducts = createAsyncThunk(
  'home/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await homeApi.getFeaturedProducts();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'home/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      return await homeApi.getNewArrivals();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch new arrivals');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'home/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await homeApi.getCategories();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchActivePromotions = createAsyncThunk(
  'home/fetchActivePromotions',
  async (_, { rejectWithValue }) => {
    try {
      return await homeApi.getActivePromotions();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch promotions');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    featuredProducts: [],
    newArrivals: [],
    categories: [],
    promotions: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Featured products
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload.data;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // New arrivals
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload.data;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Promotions
    builder
      .addCase(fetchActivePromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivePromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload.data;
      })
      .addCase(fetchActivePromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = homeSlice.actions;
export const selectFeaturedProducts = (state) => state.home.featuredProducts;
export const selectNewArrivals = (state) => state.home.newArrivals;
export const selectCategories = (state) => state.home.categories;
export const selectPromotions = (state) => state.home.promotions;
export const selectHomeLoading = (state) => state.home.loading;
export const selectHomeError = (state) => state.home.error;

export default homeSlice.reducer;

// /client/src/store/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartApi from '../api/cartApi';

// Guest cart helpers
const GUEST_KEY = 'guestCart';
const loadGuest = () => JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
const saveGuest = (items) => localStorage.setItem(GUEST_KEY, JSON.stringify(items));
const clearGuest = () => localStorage.removeItem(GUEST_KEY);

const recalc = (items) => ({
  totalItems: items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
});

// Async thunks

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    const items = loadGuest();
    return { items, ...recalc(items) };
  }
  try {
    const res = await cartApi.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load cart');
  }
});

export const addItem = createAsyncThunk('cart/addItem', async ({ product, quantity }, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    const items = loadGuest();
    const existing = items.find(i => i.product._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      items.push({ product, quantity, price: product.price });
    }
    saveGuest(items);
    return { items, ...recalc(items) };
  }
  try {
    const res = await cartApi.addToCart({ productId: product._id, quantity, price: product.price });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateItem = createAsyncThunk('cart/updateItem', async ({ productId, quantity }, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    const items = loadGuest();
    const item = items.find(i => i.product._id === productId);
    if (item) item.quantity = quantity;
    saveGuest(items);
    return { items, ...recalc(items) };
  }
  try {
    const res = await cartApi.updateCartItem(productId, { quantity });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
  }
});

export const removeItem = createAsyncThunk('cart/removeItem', async (productId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    const items = loadGuest().filter(i => i.product._id !== productId);
    saveGuest(items);
    return { items, ...recalc(items) };
  }
  try {
    const res = await cartApi.removeCartItem(productId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

export const clearCartAsync = createAsyncThunk('cart/clearCartAsync', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    clearGuest();
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
  try {
    const res = await cartApi.clearCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
  }
});

export const mergeGuestCart = createAsyncThunk('cart/mergeGuestCart', async (_, { rejectWithValue }) => {
  const guestItems = loadGuest();
  if (guestItems.length === 0) {
    const res = await cartApi.getCart();
    return res.data;
  }
  try {
    for (const item of guestItems) {
      await cartApi.addToCart({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    clearGuest();
    const res = await cartApi.getCart();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to merge cart');
  }
});

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const thunks = [fetchCart, addItem, updateItem, removeItem, clearCartAsync, mergeGuestCart];

    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalItems = action.payload.totalItems;
          state.totalPrice = action.payload.totalPrice;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectCartTotal = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

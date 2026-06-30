// /client/src/store/checkoutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as checkoutApi from '../api/checkoutApi';
import { clearCartAsync } from './cartSlice';

// Async thunks

export const validateCoupon = createAsyncThunk(
  'checkout/validateCoupon',
  async ({ couponCode, subtotal }, { rejectWithValue }) => {
    try {
      const data = await checkoutApi.validateCoupon(couponCode, subtotal);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

export const submitOrder = createAsyncThunk(
  'checkout/submitOrder',
  async ({ shippingAddress, paymentMethod, couponCode }, { dispatch, rejectWithValue }) => {
    try {
      const data = await checkoutApi.placeOrder({
        shippingAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
      });
      dispatch(clearCartAsync());
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Something went wrong');
    }
  }
);

// Initial state

const initialState = {
  step: 1,
  shippingAddress: {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  },
  paymentMethod: 'card',
  couponCode: '',
  discount: 0,
  couponError: null,
  couponApplied: false,
  loading: false,
  error: null,
  orderId: null,
};

// Slice

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    setCouponCode(state, action) {
      state.couponCode = action.payload;
    },
    clearCoupon(state) {
      state.couponCode = '';
      state.discount = 0;
      state.couponError = null;
      state.couponApplied = false;
    },
    resetCheckout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // validateCoupon
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.couponError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.discount = action.payload.discount;
        state.couponApplied = true;
        state.couponError = null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.couponError = action.payload;
        state.discount = 0;
        state.couponApplied = false;
      })
      // submitOrder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload.data.orderId;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setStep,
  setShippingAddress,
  setPaymentMethod,
  setCouponCode,
  clearCoupon,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;

// Selectors

export const selectCheckoutStep = (state) => state.checkout.step;
export const selectShippingAddress = (state) => state.checkout.shippingAddress;
export const selectPaymentMethod = (state) => state.checkout.paymentMethod;
export const selectCouponCode = (state) => state.checkout.couponCode;
export const selectDiscount = (state) => state.checkout.discount;
export const selectCouponApplied = (state) => state.checkout.couponApplied;
export const selectCouponError = (state) => state.checkout.couponError;
export const selectCheckoutLoading = (state) => state.checkout.loading;
export const selectCheckoutError = (state) => state.checkout.error;
export const selectOrderId = (state) => state.checkout.orderId;

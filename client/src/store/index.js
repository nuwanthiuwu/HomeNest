// /client/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import homeReducer from './homeSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    product: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

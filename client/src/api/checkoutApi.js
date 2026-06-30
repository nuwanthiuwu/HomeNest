// /client/src/api/checkoutApi.js
import axiosInstance from './axiosInstance';

export const placeOrder = async (payload) => {
  const response = await axiosInstance.post('/checkout', payload);
  return response.data;
};

export const getOrderConfirmation = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}/confirmation`);
  return response.data;
};

export const validateCoupon = async (couponCode, subtotal) => {
  const response = await axiosInstance.post('/checkout/validate-coupon', { couponCode, subtotal });
  return response.data;
};

// /client/src/api/homeApi.js
import axiosInstance from './axiosInstance';

export const getFeaturedProducts = async (limit = 8) => {
  const response = await axiosInstance.get('/products', { params: { featured: true, limit } });
  return response.data;
};

export const getNewArrivals = async (limit = 8) => {
  const response = await axiosInstance.get('/products', { params: { sort: 'newest', limit } });
  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const getActivePromotions = async () => {
  const response = await axiosInstance.get('/promotions/active');
  return response.data;
};

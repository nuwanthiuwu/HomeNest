// /client/src/api/productApi.js
import axiosInstance from './axiosInstance';

export const getProducts = async (params) => {
  const response = await axiosInstance.get('/products', { params });
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await axiosInstance.get('/products/search', { params: { q: query } });
  return response.data;
};

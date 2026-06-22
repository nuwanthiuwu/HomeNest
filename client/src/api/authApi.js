// /client/src/api/authApi.js
import axiosInstance from './axiosInstance';

export const register = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await axiosInstance.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post('/auth/reset-password', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/auth/profile', data);
  return response.data;
};

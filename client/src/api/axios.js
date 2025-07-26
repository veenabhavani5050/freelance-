// src/api/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = `${import.meta.env.VITE_API_URL}/api`; // ✅ Add /api here

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Session expired, please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

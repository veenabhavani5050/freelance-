// client/src/api/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type only if not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      toast.error('Session expired, please log in again.', { theme: 'colored' });
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (message) {
      toast.error(message, { theme: 'colored' });
    } else if (status === 403) {
      toast.error('Access denied.', { theme: 'colored' });
    } else if (status === 500) {
      toast.error('Server error, please try again later.', { theme: 'colored' });
    } else {
      toast.error('An unexpected error occurred.', { theme: 'colored' });
    }

    return Promise.reject(error);
  }
);

export default API;

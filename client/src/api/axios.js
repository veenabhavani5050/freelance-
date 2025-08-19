// client/src/api/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';

// The base URL for your API, derived from your environment variables
const baseURL = `${import.meta.env.VITE_API_URL}/api`;

const API = axios.create({
  baseURL,
  withCredentials: true, // This ensures cookies (like the JWT) are sent with requests
});

// Request Interceptor: Automatically adds the JWT token to every request
API.interceptors.request.use(
  (config) => {
    // Get the user data and token from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type only if the request data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles common API errors like 401, 403, and 500
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      // Session expired or invalid token
      toast.error('Session expired, please log in again.', { theme: 'colored' });
      localStorage.removeItem('user'); // Clear local storage
      window.location.href = '/login'; // Redirect to login page
    } else if (message) {
      // Display specific error message from the backend
      toast.error(message, { theme: 'colored' });
    } else if (status === 403) {
      // Access denied due to insufficient role
      toast.error('Access denied.', { theme: 'colored' });
    } else if (status === 500) {
      // Server-side error
      toast.error('Server error, please try again later.', { theme: 'colored' });
    } else {
      // Generic unexpected error
      toast.error('An unexpected error occurred.', { theme: 'colored' });
    }

    return Promise.reject(error);
  }
);

export default API;
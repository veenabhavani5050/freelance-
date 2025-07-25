// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // should be http://localhost:5000
  withCredentials: true,
});

export default API;

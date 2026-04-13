import axios from 'axios';

// create axios instance with base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handle token expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const currentPath = window.location.pathname;
      const authPages = ['/login', '/staff-login', '/register'];

      // Do not redirect when already on an auth page, so login errors can be shown.
      if (!authPages.includes(currentPath)) {
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/manager') || currentPath.startsWith('/technician')) {
          window.location.href = '/staff-login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
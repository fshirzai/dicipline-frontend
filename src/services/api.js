import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('discipline-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ============================================
    // 401 on login/register = BAD CREDENTIALS, not expired session
    // Do NOT redirect or clear token here — let the caller handle it
    // ============================================
    const isAuthEndpoint =
      url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      // Session expired on a protected route — clear and redirect
      localStorage.removeItem('discipline-token');
      delete api.defaults.headers.common['Authorization'];

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 404 - just reject, don't redirect
    if (status === 404) {
      return Promise.reject(error);
    }

    // Network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error - please check your connection');
      return Promise.reject({
        ...error,
        message: 'Network error - please check your connection',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
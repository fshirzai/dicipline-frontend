import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('discipline-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('discipline-token');
      delete api.defaults.headers.common['Authorization'];
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 404 Not Found - don't redirect, just return error
    if (error.response?.status === 404) {
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error - please check your connection');
      return Promise.reject({ 
        ...error, 
        message: 'Network error - please check your connection' 
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
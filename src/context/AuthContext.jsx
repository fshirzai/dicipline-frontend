import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('discipline-token'));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Fetch user error:', error.response?.data || error.message);
      // Clear invalid token silently (no toast — this is background fetch)
      localStorage.removeItem('discipline-token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('discipline-token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      return { success: false, error: message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('discipline-token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      const errors = error.response?.data?.errors;

      return { success: false, error: message, errors };
    }
  };

  const logout = () => {
    localStorage.removeItem('discipline-token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
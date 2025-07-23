import axios from 'axios';

const AUTH_API_URL = 'http://localhost:5000/api';

// Create separate axios instance for auth (no auth interceptors)
const authAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service
export const authService = {
  // User registration
  signup: async (userData) => {
    try {
      const response = await authAPI.post('/auth/signup', userData);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // User logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      // Basic token validation (you might want to verify expiration)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Refresh token (if your backend supports it)
  refreshToken: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const response = await authAPI.post('/auth/refresh', { token });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await authAPI.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Forgot password request failed' };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authAPI.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },
};

export default authService;
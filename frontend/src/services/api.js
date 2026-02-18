import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Products API
export const productsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.price_min !== undefined) params.append('price_min', filters.price_min);
    if (filters.price_max !== undefined) params.append('price_max', filters.price_max);
    if (filters.category) params.append('category', filters.category);
    return api.get(`/products?${params.toString()}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
};

// Stock API
export const stockAPI = {
  check: () => api.get('/stock/check'),
};

// Expiry API
export const expiryAPI = {
  getClosest: (days = 30) => api.get(`/products/expiry/closest?days=${days}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;

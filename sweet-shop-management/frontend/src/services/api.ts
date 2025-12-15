import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },
};

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets');
    return response.data;
  },
  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets/search', { params });
    return response.data;
  },
  create: async (data: {
    name: string;
    category: string;
    price: number;
    quantity?: number;
  }): Promise<Sweet> => {
    const response = await api.post('/api/sweets', data);
    return response.data;
  },
  update: async (id: number, data: Partial<Sweet>): Promise<Sweet> => {
    const response = await api.put(`/api/sweets/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/sweets/${id}`);
  },
  purchase: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/purchase`, { quantity });
    return response.data;
  },
  restock: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/api/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};

export default api;


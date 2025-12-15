export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity?: number;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface SearchQuery {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}


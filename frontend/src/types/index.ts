// User types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface BodyData {
  id: number;
  user_id: number;
  height: number;
  weight: number;
  age?: number;
  gender?: string;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder_width?: number;
  preferred_style?: string;
  created_at: string;
}

// Clothing types
export type ClothingCategory = 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'shoes' | 'accessories';

export interface ClothingItem {
  id: number;
  user_id: number;
  name: string;
  category: ClothingCategory;
  color?: string;
  season?: string;
  brand?: string;
  size?: string;
  image_url?: string;
  thumbnail_url?: string;
  tags?: string;
  is_favorite: number;
  created_at: string;
}

// Outfit types
export interface Outfit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  style_tags?: string;
  occasion?: string;
  season?: string;
  is_public: number;
  likes_count: number;
  image_url?: string;
  created_at: string;
  items: ClothingItem[];
}

// Auth types
export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

import { api } from './api';
import { ApiResponse, MenuItem } from '../types';

export interface MenuQueryParams {
  category?: string;
  search?: string;
  vegetarian?: boolean;
  featured?: boolean;
  available?: boolean;
  active?: string;
  page?: number;
  limit?: number;
}

export interface MenuItemPayload {
  category: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  preparationTime?: number;
}

export const getMenuItems = async (params: MenuQueryParams = {}): Promise<ApiResponse<MenuItem[]>> => {
  const query = new URLSearchParams();

  if (params.category) query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.vegetarian !== undefined) query.append('vegetarian', String(params.vegetarian));
  if (params.featured !== undefined) query.append('featured', String(params.featured));
  if (params.available !== undefined) query.append('available', String(params.available));
  if (params.active) query.append('active', params.active);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const response = await api.get<ApiResponse<MenuItem[]>>(`/menu?${query.toString()}`);
  return response.data;
};

export const getMenuItemById = async (id: string): Promise<ApiResponse<MenuItem>> => {
  const response = await api.get<ApiResponse<MenuItem>>(`/menu/${id}`);
  return response.data;
};

export const createMenuItem = async (payload: MenuItemPayload): Promise<ApiResponse<MenuItem>> => {
  const response = await api.post<ApiResponse<MenuItem>>('/menu', payload);
  return response.data;
};

export const updateMenuItem = async (
  id: string,
  payload: Partial<MenuItemPayload>
): Promise<ApiResponse<MenuItem>> => {
  const response = await api.put<ApiResponse<MenuItem>>(`/menu/${id}`, payload);
  return response.data;
};

export const deleteMenuItem = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/menu/${id}`);
  return response.data;
};

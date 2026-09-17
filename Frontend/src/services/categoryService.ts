import { api } from './api';
import { ApiResponse, Category } from '../types';

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export const getCategories = async (includeInactive = false): Promise<ApiResponse<Category[]>> => {
  const response = await api.get<ApiResponse<Category[]>>(`/categories?includeInactive=${includeInactive}`);
  return response.data;
};

export const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
  const response = await api.post<ApiResponse<Category>>('/categories', payload);
  return response.data;
};

export const updateCategory = async (
  id: string,
  payload: Partial<CategoryPayload>
): Promise<ApiResponse<Category>> => {
  const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
  return response.data;
};

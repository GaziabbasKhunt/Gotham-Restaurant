import { api } from './api';
import { ApiResponse, User, UserRole } from '../types';

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};

export const updateUserRole = async (
  id: string,
  role: UserRole
): Promise<ApiResponse<User>> => {
  const response = await api.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
  return response.data;
};

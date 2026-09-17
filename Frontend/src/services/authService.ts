import { api } from './api';
import { ApiResponse, User } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> => {
  const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
  const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return response.data;
};

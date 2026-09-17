import { api } from './api';
import { ApiResponse, RestaurantTable, TableStatus } from '../types';

export interface TablePayload {
  tableNumber: string;
  capacity: number;
  location?: string;
  status?: TableStatus;
  isActive?: boolean;
}

export const getTables = async (): Promise<ApiResponse<RestaurantTable[]>> => {
  const response = await api.get<ApiResponse<RestaurantTable[]>>('/tables');
  return response.data;
};

export const getTableById = async (id: string): Promise<ApiResponse<RestaurantTable>> => {
  const response = await api.get<ApiResponse<RestaurantTable>>(`/tables/${id}`);
  return response.data;
};

export const createTable = async (payload: TablePayload): Promise<ApiResponse<RestaurantTable>> => {
  const response = await api.post<ApiResponse<RestaurantTable>>('/tables', payload);
  return response.data;
};

export const updateTable = async (
  id: string,
  payload: Partial<TablePayload>
): Promise<ApiResponse<RestaurantTable>> => {
  const response = await api.put<ApiResponse<RestaurantTable>>(`/tables/${id}`, payload);
  return response.data;
};

export const deleteTable = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/tables/${id}`);
  return response.data;
};

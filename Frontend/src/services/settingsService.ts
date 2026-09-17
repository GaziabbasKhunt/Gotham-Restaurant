import { api } from './api';
import { ApiResponse, RestaurantSettings } from '../types';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalReservations: number;
  totalMenuItems: number;
  totalCustomers: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  }>;
}

export const getSettings = async (): Promise<ApiResponse<RestaurantSettings>> => {
  const response = await api.get<ApiResponse<RestaurantSettings>>('/settings');
  return response.data;
};

export const updateSettings = async (
  payload: Partial<RestaurantSettings>
): Promise<ApiResponse<RestaurantSettings>> => {
  const response = await api.put<ApiResponse<RestaurantSettings>>('/settings', payload);
  return response.data;
};

export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await api.get<ApiResponse<DashboardStats>>('/settings/dashboard');
  return response.data;
};

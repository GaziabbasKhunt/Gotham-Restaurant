import { api } from './api';
import { ApiResponse, Order, OrderType, PaymentMethod, Address, OrderStatus } from '../types';

export interface CreateOrderPayload {
  items: Array<{
    menuItem: string;
    quantity: number;
  }>;
  orderType: OrderType;
  deliveryAddress?: Address;
  paymentMethod: PaymentMethod;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>('/orders', payload);
  return response.data;
};

export const getMyOrders = async (): Promise<ApiResponse<Order[]>> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
  return response.data;
};

export const getAllOrders = async (status?: string): Promise<ApiResponse<Order[]>> => {
  const query = status ? `?status=${status}` : '';
  const response = await api.get<ApiResponse<Order[]>>(`/orders${query}`);
  return response.data;
};

export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (
  id: string,
  orderStatus: OrderStatus
): Promise<ApiResponse<Order>> => {
  const response = await api.put<ApiResponse<Order>>(`/orders/${id}/status`, { orderStatus });
  return response.data;
};

export const cancelOrder = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await api.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
  return response.data;
};

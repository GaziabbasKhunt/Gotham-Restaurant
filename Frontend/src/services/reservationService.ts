import { api } from './api';
import { ApiResponse, Reservation, RestaurantTable, ReservationStatus } from '../types';

export interface CreateReservationPayload {
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  numberOfGuests: number;
  table?: string;
  specialRequest?: string;
}

export const getAvailableTables = async (
  date?: string,
  time?: string,
  guests?: number
): Promise<ApiResponse<RestaurantTable[]>> => {
  const query = new URLSearchParams();
  if (date) query.append('date', date);
  if (time) query.append('time', time);
  if (guests) query.append('guests', String(guests));

  const response = await api.get<ApiResponse<RestaurantTable[]>>(`/tables?${query.toString()}`);
  return response.data;
};

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<ApiResponse<Reservation>> => {
  const response = await api.post<ApiResponse<Reservation>>('/reservations', payload);
  return response.data;
};

export const getMyReservations = async (): Promise<ApiResponse<Reservation[]>> => {
  const response = await api.get<ApiResponse<Reservation[]>>('/reservations/my-reservations');
  return response.data;
};

export const getAllReservations = async (status?: string): Promise<ApiResponse<Reservation[]>> => {
  const query = status ? `?status=${status}` : '';
  const response = await api.get<ApiResponse<Reservation[]>>(`/reservations${query}`);
  return response.data;
};

export const updateReservationStatus = async (
  id: string,
  status: ReservationStatus
): Promise<ApiResponse<Reservation>> => {
  const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
  return response.data;
};

export const cancelReservation = async (id: string): Promise<ApiResponse<Reservation>> => {
  const response = await api.delete<ApiResponse<Reservation>>(`/reservations/${id}`);
  return response.data;
};

import { api } from './api';
import { ApiResponse, Review } from '../types';

export interface CreateReviewPayload {
  menuItem: string;
  rating: number;
  comment: string;
}

export const createReview = async (payload: CreateReviewPayload): Promise<ApiResponse<Review>> => {
  const response = await api.post<ApiResponse<Review>>('/reviews', payload);
  return response.data;
};

export const getMenuItemReviews = async (menuItemId: string): Promise<ApiResponse<Review[]>> => {
  const response = await api.get<ApiResponse<Review[]>>(`/reviews/menu/${menuItemId}/reviews`);
  return response.data;
};

export const getAllReviews = async (): Promise<ApiResponse<Review[]>> => {
  const response = await api.get<ApiResponse<Review[]>>('/reviews');
  return response.data;
};

export const moderateReview = async (
  id: string,
  isApproved: boolean
): Promise<ApiResponse<Review>> => {
  const response = await api.put<ApiResponse<Review>>(`/reviews/${id}`, { isApproved });
  return response.data;
};

export const deleteReview = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/reviews/${id}`);
  return response.data;
};

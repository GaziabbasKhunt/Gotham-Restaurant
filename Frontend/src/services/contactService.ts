import { api } from './api';
import { ApiResponse, ContactMessage } from '../types';

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (payload: ContactFormPayload): Promise<ApiResponse<ContactMessage>> => {
  const response = await api.post<ApiResponse<ContactMessage>>('/contact', payload);
  return response.data;
};

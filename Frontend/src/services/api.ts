import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse, HealthStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to automatically attach JWT token when stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gotham_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const customMessage = error.response?.data?.message || error.message || 'An unexpected API error occurred';
    return Promise.reject(new Error(customMessage));
  }
);

// Basic health check API call
export const getHealthStatus = async (): Promise<ApiResponse<HealthStatus>> => {
  const response = await api.get<ApiResponse<HealthStatus>>('/health');
  return response.data;
};

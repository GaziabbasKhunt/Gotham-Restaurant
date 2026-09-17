// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

// User Profile & Roles
export type UserRole = 'customer' | 'admin';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: Address;
  loyaltyPoints?: number;
  loyaltyTier?: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Menu Item
export interface MenuItem {
  _id: string;
  category: string | Category;
  name: string;
  description: string;
  price: number;
  image?: string;
  ingredients?: string[];
  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  preparationTime?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Item State
export interface CartItem {
  item: MenuItem;
  quantity: number;
}

// Order Types
export type OrderType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'cash' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItemSnapshot {
  menuItem: string | MenuItem;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: OrderItemSnapshot[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discountAmount?: number;
  couponCode?: string;
  pointsEarned?: number;
  totalAmount: number;
  orderType: OrderType;
  deliveryAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Restaurant Table Types
export type TableStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface RestaurantTable {
  _id: string;
  tableNumber: string;
  capacity: number;
  location?: string;
  status: TableStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Reservation Types
export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  _id: string;
  user: string | User;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  numberOfGuests: number;
  table: RestaurantTable;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: string | Partial<User>;
  menuItem: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export type ContactStatus = 'new' | 'read' | 'resolved';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

// System Health Data
export interface HealthStatus {
  status: string;
  database: string;
  timestamp: string;
  uptimeSeconds: number;
}

// Restaurant Settings Types
export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface RestaurantSettings {
  _id?: string;
  restaurantName: string;
  logo?: string;
  description?: string;
  phone: string;
  email: string;
  address?: Address;
  openingHours?: OpeningHours;
  taxPercentage: number;
  deliveryCharge: number;
  minimumOrderAmount: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}


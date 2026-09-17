import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAddress } from './User';

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

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharge: number;
  discountAmount?: number;
  couponCode?: string;
  pointsEarned?: number;
  totalAmount: number;
  orderType: OrderType;
  deliveryAddress?: IAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    }
  },
  { _id: false }
);

const AddressSchema = new Schema<IAddress>(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: IOrderItem[]) => val.length > 0, 'Order must contain at least one item']
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    couponCode: {
      type: String,
      trim: true
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup', 'dine_in'],
      default: 'delivery'
    },
    deliveryAddress: {
      type: AddressSchema,
      default: {}
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online'],
      default: 'cash'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Performance & Lookup Indexes
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

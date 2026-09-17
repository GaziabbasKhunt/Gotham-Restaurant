import mongoose, { Schema, Document, Model } from 'mongoose';

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface IRestaurantTable extends Document {
  _id: mongoose.Types.ObjectId;
  tableNumber: string;
  capacity: number;
  location?: string;
  status: TableStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantTableSchema = new Schema<IRestaurantTable>(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Table capacity is required'],
      min: [1, 'Capacity must be at least 1 guest']
    },
    location: {
      type: String,
      default: 'Main Dining Room',
      trim: true
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied', 'maintenance'],
      default: 'available'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
RestaurantTableSchema.index({ capacity: 1 });
RestaurantTableSchema.index({ status: 1 });
RestaurantTableSchema.index({ isActive: 1 });

export const RestaurantTable: Model<IRestaurantTable> = mongoose.model<IRestaurantTable>(
  'RestaurantTable',
  RestaurantTableSchema
);

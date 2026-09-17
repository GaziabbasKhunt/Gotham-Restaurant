import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  numberOfGuests: number;
  table: mongoose.Types.ObjectId;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Reservation date is required']
    },
    time: {
      type: String,
      required: [true, 'Reservation time slot is required'],
      trim: true
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Guest count must be at least 1']
    },
    table: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantTable',
      required: [true, 'Assigned table reference is required']
    },
    specialRequest: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for Double-Booking Prevention & Quick Querying
ReservationSchema.index({ date: 1, time: 1, table: 1 });
ReservationSchema.index({ user: 1 });
ReservationSchema.index({ status: 1 });

export const Reservation: Model<IReservation> = mongoose.model<IReservation>(
  'Reservation',
  ReservationSchema
);

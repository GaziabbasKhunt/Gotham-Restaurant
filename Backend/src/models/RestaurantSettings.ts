import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAddress } from './User';

export interface IOpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface IRestaurantSettings extends Document {
  _id: mongoose.Types.ObjectId;
  restaurantName: string;
  logo?: string;
  description?: string;
  phone: string;
  email: string;
  address?: IAddress;
  openingHours?: IOpeningHours;
  taxPercentage: number;
  deliveryCharge: number;
  minimumOrderAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

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

const OpeningHoursSchema = new Schema<IOpeningHours>(
  {
    monday: { type: String, default: '5:00 PM - 11:00 PM' },
    tuesday: { type: String, default: '5:00 PM - 11:00 PM' },
    wednesday: { type: String, default: '5:00 PM - 11:00 PM' },
    thursday: { type: String, default: '5:00 PM - 11:00 PM' },
    friday: { type: String, default: '5:00 PM - 12:00 AM' },
    saturday: { type: String, default: '5:00 PM - 12:00 AM' },
    sunday: { type: String, default: '4:00 PM - 10:00 PM' }
  },
  { _id: false }
);

const RestaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    restaurantName: {
      type: String,
      required: true,
      default: 'Gotham Restaurant',
      trim: true
    },
    logo: {
      type: String,
      default: '/logo.svg'
    },
    description: {
      type: String,
      default: 'Where dark elegance meets culinary passion.',
      trim: true
    },
    phone: {
      type: String,
      default: '+1 (555) 468-4261',
      trim: true
    },
    email: {
      type: String,
      default: 'reservations@gothamrestaurant.com',
      lowercase: true,
      trim: true
    },
    address: {
      type: AddressSchema,
      default: {
        street: '100 Wayne Manor Blvd',
        city: 'Gotham City',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      }
    },
    openingHours: {
      type: OpeningHoursSchema,
      default: {}
    },
    taxPercentage: {
      type: Number,
      default: 5
    },
    deliveryCharge: {
      type: Number,
      default: 50
    },
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: '₹'
    }
  },
  {
    timestamps: true
  }
);

export const RestaurantSettings: Model<IRestaurantSettings> = mongoose.model<IRestaurantSettings>(
  'RestaurantSettings',
  RestaurantSettingsSchema
);

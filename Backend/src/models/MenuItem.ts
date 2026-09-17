import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
    },
    ingredients: {
      type: [String],
      default: []
    },
    isVegetarian: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number,
      default: 20
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ isActive: 1 });
MenuItemSchema.index({ isAvailable: 1 });
MenuItemSchema.index({ isFeatured: 1 });

export const MenuItem: Model<IMenuItem> = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

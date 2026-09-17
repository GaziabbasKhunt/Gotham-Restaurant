import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'admin';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type LoyaltyTier = 'Bronze Gargoyle' | 'Silver Sentinel' | 'Gold Vigilante' | 'Dark Knight VIP';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  address?: IAddress;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    address: {
      type: AddressSchema,
      default: {}
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    loyaltyTier: {
      type: String,
      enum: ['Bronze Gargoyle', 'Silver Sentinel', 'Gold Vigilante', 'Dark Knight VIP'],
      default: 'Bronze Gargoyle'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook for hashing password
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

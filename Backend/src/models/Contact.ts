import mongoose, { Schema, Document, Model } from 'mongoose';

export type ContactStatus = 'new' | 'read' | 'resolved';

export interface IContact extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message body is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

export const Contact: Model<IContact> = mongoose.model<IContact>('Contact', ContactSchema);

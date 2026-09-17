import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  menuItem: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    isApproved: {
      type: Boolean,
      default: true // Auto-approved for demonstration, can be moderated by admin
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes
ReviewSchema.index({ menuItem: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ isApproved: 1 });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

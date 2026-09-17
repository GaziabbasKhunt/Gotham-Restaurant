import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review';
import { MenuItem } from '../models/MenuItem';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to post a dish review');
    }

    const { menuItem, rating, comment } = req.body;

    if (!menuItem || !rating || !comment) {
      throw new ApiError(400, 'Menu item ID, rating (1-5), and comment are required');
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      throw new ApiError(400, 'Rating must be a number between 1 and 5');
    }

    const itemExists = await MenuItem.findById(menuItem);
    if (!itemExists) {
      throw new ApiError(404, 'Menu item not found');
    }

    const review = await Review.create({
      user: req.user._id,
      menuItem,
      rating: numRating,
      comment: comment.trim(),
      isApproved: true
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    sendApiResponse(res, 201, 'Review submitted successfully', populatedReview);
  } catch (error) {
    next(error);
  }
};

export const getMenuItemReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuItemId } = req.params;

    const reviews = await Review.find({
      menuItem: menuItemId,
      isApproved: true
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    sendApiResponse(res, 200, 'Reviews retrieved successfully', reviews, {
      totalReviews,
      avgRating
    });
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (isApproved === undefined) {
      throw new ApiError(400, 'isApproved status is required');
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: !!isApproved },
      { new: true }
    ).populate('user', 'name');

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    sendApiResponse(res, 200, 'Review moderation updated', review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (req.user?.role !== 'admin' && review.user.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, 'You are not authorized to delete this review');
    }

    await Review.findByIdAndDelete(id);

    sendApiResponse(res, 200, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('menuItem', 'name')
      .sort({ createdAt: -1 });

    sendApiResponse(res, 200, 'All reviews retrieved successfully', reviews);
  } catch (error) {
    next(error);
  }
};


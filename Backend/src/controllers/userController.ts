import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, page = '1', limit = '15' } = req.query;
    const filter: Record<string, unknown> = {};

    if (role && typeof role === 'string') {
      filter.role = role;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 15);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    sendApiResponse(res, 200, 'User directory retrieved', users, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles: UserRole[] = ['customer', 'admin'];
    if (!role || !validRoles.includes(role)) {
      throw new ApiError(400, 'Invalid user role specified');
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, 'User account not found');
    }

    sendApiResponse(res, 200, 'User role updated successfully', user);
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';
import { generateToken } from '../utils/jwt';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required fields');
    }

    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters long');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(400, 'An account with this email address already exists');
    }

    // Role assignment security: default to customer unless specifically assigned during setup
    const userRole: UserRole = role === 'admin' ? 'admin' : 'customer';

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      address,
      role: userRole
    });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    sendApiResponse(res, 201, 'User registered successfully', {
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password credentials');
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    });

    // Sanitize user object for response
    const userObj = user.toJSON();

    sendApiResponse(res, 200, 'Authentication successful', {
      token,
      user: userObj
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated');
    }

    sendApiResponse(res, 200, 'User profile fetched successfully', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

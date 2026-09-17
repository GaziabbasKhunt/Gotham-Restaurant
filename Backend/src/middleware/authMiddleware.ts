import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyToken } from '../utils/jwt';
import { User, UserRole } from '../models/User';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Authentication token missing');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User account associated with token no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token'));
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role '${req.user.role}' is not authorized to access this resource`)
      );
    }

    next();
  };
};

import { Request, Response, NextFunction } from 'express';
import { RestaurantSettings } from '../models/RestaurantSettings';
import { Order } from '../models/Order';
import { Reservation } from '../models/Reservation';
import { MenuItem } from '../models/MenuItem';
import { User } from '../models/User';
import { sendApiResponse } from '../utils/apiResponse';

export const getSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create({});
    }
    sendApiResponse(res, 200, 'Restaurant settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await RestaurantSettings.findOne();
    if (!settings) {
      settings = await RestaurantSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    sendApiResponse(res, 200, 'Restaurant settings updated successfully', settings);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total sales from non-cancelled orders
    const salesResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

    // Get 5 recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id orderNumber customerName totalAmount orderStatus createdAt');

    const stats = {
      totalSales,
      totalOrders,
      totalReservations,
      totalMenuItems,
      totalCustomers,
      recentOrders
    };

    sendApiResponse(res, 200, 'Dashboard statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

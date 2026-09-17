import { Request, Response, NextFunction } from 'express';
import { RestaurantSettings } from '../models/RestaurantSettings';
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

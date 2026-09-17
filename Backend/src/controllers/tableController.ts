import { Request, Response, NextFunction } from 'express';
import { RestaurantTable } from '../models/RestaurantTable';
import { Reservation } from '../models/Reservation';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const getTables = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, time, guests } = req.query;

    const baseFilter: Record<string, unknown> = { isActive: true };

    if (guests) {
      baseFilter.capacity = { $gte: parseInt(guests as string, 10) || 1 };
    }

    let tables = await RestaurantTable.find(baseFilter).sort({ capacity: 1, tableNumber: 1 });

    // If date and time filters provided, filter out tables already reserved for that slot
    if (date && time) {
      const reservationDate = new Date(date as string);
      const startOfDay = new Date(reservationDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(reservationDate.setHours(23, 59, 59, 999));

      const bookedReservations = await Reservation.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        time: (time as string).trim(),
        status: { $in: ['pending', 'confirmed'] }
      }).select('table');

      const bookedTableIds = new Set(bookedReservations.map((r) => r.table.toString()));
      tables = tables.filter((table) => !bookedTableIds.has(table._id.toString()));
    }

    sendApiResponse(res, 200, 'Tables retrieved successfully', tables);
  } catch (error) {
    next(error);
  }
};

export const getTableById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findById(id);

    if (!table) {
      throw new ApiError(404, 'Restaurant table not found');
    }

    sendApiResponse(res, 200, 'Table details retrieved', table);
  } catch (error) {
    next(error);
  }
};

export const createTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tableNumber, capacity, location, status, isActive } = req.body;

    if (!tableNumber || !capacity) {
      throw new ApiError(400, 'Table number and capacity are required');
    }

    const existingTable = await RestaurantTable.findOne({ tableNumber: tableNumber.trim().toUpperCase() });
    if (existingTable) {
      throw new ApiError(400, `Table '${tableNumber}' already exists in restaurant directory`);
    }

    const table = await RestaurantTable.create({
      tableNumber: tableNumber.trim().toUpperCase(),
      capacity: Number(capacity),
      location: location || 'Main Dining Room',
      status: status || 'available',
      isActive: isActive !== undefined ? !!isActive : true
    });

    sendApiResponse(res, 201, 'Restaurant table created successfully', table);
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.tableNumber) {
      updates.tableNumber = updates.tableNumber.trim().toUpperCase();
      const existingTable = await RestaurantTable.findOne({
        tableNumber: updates.tableNumber,
        _id: { $ne: id }
      });
      if (existingTable) {
        throw new ApiError(400, `Another table with number '${updates.tableNumber}' already exists`);
      }
    }

    const table = await RestaurantTable.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!table) {
      throw new ApiError(404, 'Restaurant table not found');
    }

    sendApiResponse(res, 200, 'Restaurant table updated successfully', table);
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!table) {
      throw new ApiError(404, 'Restaurant table not found');
    }

    sendApiResponse(res, 200, 'Restaurant table deactivated successfully', table);
  } catch (error) {
    next(error);
  }
};

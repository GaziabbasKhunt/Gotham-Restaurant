import { Request, Response, NextFunction } from 'express';
import { Reservation, ReservationStatus } from '../models/Reservation';
import { RestaurantTable } from '../models/RestaurantTable';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required to make a table reservation');
    }

    const {
      customerName,
      phone,
      email,
      date,
      time,
      numberOfGuests,
      table: requestedTableId,
      specialRequest
    } = req.body;

    if (!customerName || !phone || !email || !date || !time || !numberOfGuests) {
      throw new ApiError(400, 'Customer name, phone, email, date, time, and number of guests are required');
    }

    const guestCount = parseInt(numberOfGuests as string, 10);
    if (isNaN(guestCount) || guestCount < 1) {
      throw new ApiError(400, 'Number of guests must be at least 1');
    }

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      throw new ApiError(400, 'Invalid reservation date format');
    }

    const startOfDay = new Date(reservationDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(reservationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const timeSlot = time.trim();

    let targetTableId = requestedTableId;

    if (targetTableId) {
      // Validate requested table
      const assignedTable = await RestaurantTable.findById(targetTableId);
      if (!assignedTable || !assignedTable.isActive) {
        throw new ApiError(400, 'Selected restaurant table is not active or available');
      }

      if (assignedTable.status === 'maintenance') {
        throw new ApiError(400, `Table '${assignedTable.tableNumber}' is currently under maintenance`);
      }

      if (assignedTable.capacity < guestCount) {
        throw new ApiError(
          400,
          `Table '${assignedTable.tableNumber}' capacity (${assignedTable.capacity}) is less than requested guests (${guestCount})`
        );
      }
    } else {
      // Auto-assign suitable available table
      const candidateTables = await RestaurantTable.find({
        isActive: true,
        status: { $ne: 'maintenance' },
        capacity: { $gte: guestCount }
      }).sort({ capacity: 1 });

      if (candidateTables.length === 0) {
        throw new ApiError(400, `No active tables available accommodating ${guestCount} guests`);
      }

      // Find first table not booked for this date and time slot
      for (const tableCandidate of candidateTables) {
        const conflict = await Reservation.findOne({
          table: tableCandidate._id,
          date: { $gte: startOfDay, $lte: endOfDay },
          time: timeSlot,
          status: { $in: ['pending', 'confirmed'] }
        });

        if (!conflict) {
          targetTableId = tableCandidate._id;
          break;
        }
      }

      if (!targetTableId) {
        throw new ApiError(400, `All suitable tables are fully booked for ${date} at ${timeSlot}`);
      }
    }

    // DOUBLE-BOOKING PREVENTION CHECK
    const existingConflict = await Reservation.findOne({
      table: targetTableId,
      date: { $gte: startOfDay, $lte: endOfDay },
      time: timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingConflict) {
      throw new ApiError(
        400,
        `Table is already reserved for the selected date (${date}) and time slot (${timeSlot}). Please select another time or table.`
      );
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      date: startOfDay,
      time: timeSlot,
      numberOfGuests: guestCount,
      table: targetTableId,
      specialRequest: specialRequest ? specialRequest.trim() : undefined,
      status: 'confirmed'
    });

    const populatedReservation = await Reservation.findById(reservation._id).populate('table');

    sendApiResponse(res, 201, 'Table reservation confirmed successfully', populatedReservation);
  } catch (error) {
    next(error);
  }
};

export const getMyReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table')
      .sort({ date: -1, time: -1 });

    sendApiResponse(res, 200, 'Customer reservations retrieved', reservations);
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, date, page = '1', limit = '15' } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    if (date && typeof date === 'string') {
      const resDate = new Date(date);
      const start = new Date(resDate.setHours(0, 0, 0, 0));
      const end = new Date(resDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 15);
    const skip = (pageNum - 1) * limitNum;

    const total = await Reservation.countDocuments(filter);
    const reservations = await Reservation.find(filter)
      .populate('table')
      .populate('user', 'name email phone')
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(limitNum);

    sendApiResponse(res, 200, 'All restaurant reservations retrieved', reservations, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('table').populate('user', 'name email phone');

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (req.user?.role !== 'admin' && reservation.user._id.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, 'You are not authorized to view this reservation');
    }

    sendApiResponse(res, 200, 'Reservation details retrieved', reservation);
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid reservation status');
    }

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('table');

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    sendApiResponse(res, 200, 'Reservation status updated', reservation);
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      throw new ApiError(404, 'Reservation not found');
    }

    if (req.user?.role !== 'admin' && reservation.user.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, 'You are not authorized to cancel this reservation');
    }

    reservation.status = 'cancelled';
    await reservation.save();

    sendApiResponse(res, 200, 'Reservation cancelled successfully', reservation);
  } catch (error) {
    next(error);
  }
};

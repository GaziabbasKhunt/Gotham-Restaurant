import { Request, Response, NextFunction } from 'express';
import { Contact, ContactStatus } from '../models/Contact';
import { ApiError } from '../utils/apiError';
import { sendApiResponse } from '../utils/apiResponse';

export const submitContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      throw new ApiError(400, 'Name, email, subject, and message are required');
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    sendApiResponse(res, 201, 'Thank you for reaching out! Your message has been received.', contact);
  } catch (error) {
    next(error);
  }
};

export const getAllContactMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = '1', limit = '15' } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 15);
    const skip = (pageNum - 1) * limitNum;

    const total = await Contact.countDocuments(filter);
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    sendApiResponse(res, 200, 'Contact messages retrieved', messages, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ContactStatus[] = ['new', 'read', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(400, 'Invalid contact status');
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      throw new ApiError(404, 'Contact submission not found');
    }

    sendApiResponse(res, 200, 'Contact status updated', contact);
  } catch (error) {
    next(error);
  }
};

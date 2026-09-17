import { Response } from 'express';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendApiResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): Response => {
  const payload: ApiResponsePayload<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta })
  };

  return res.status(statusCode).json(payload);
};

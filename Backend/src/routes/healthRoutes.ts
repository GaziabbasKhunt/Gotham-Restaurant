import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendApiResponse } from '../utils/apiResponse';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbStatus = dbStateMap[mongoose.connection.readyState] || 'unknown';

  sendApiResponse(res, 200, 'Gotham Restaurant API is healthy and operational', {
    status: 'UP',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

export default router;

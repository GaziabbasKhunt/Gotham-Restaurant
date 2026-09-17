import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import tableRoutes from './routes/tableRoutes';
import reservationRoutes from './routes/reservationRoutes';
import reviewRoutes from './routes/reviewRoutes';
import contactRoutes from './routes/contactRoutes';
import settingsRoutes from './routes/settingsRoutes';
import userRoutes from './routes/userRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { ApiError } from './utils/apiError';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userRoutes);

// Root greeting endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Gotham Restaurant API. Use /api/health for system state.'
  });
});

// 404 Route Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, 'API endpoint not found'));
});

// Centralized Error Middleware
app.use(errorMiddleware);

export default app;

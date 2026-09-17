import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gotham_restaurant',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_jwt_secret_gotham_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

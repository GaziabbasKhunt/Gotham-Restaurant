import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${(error as Error).message}`);
    // Do not crash server in dev mode if DB is disconnected, but log clearly
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Mongoose connection error: ${err.message}`);
});

import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`[Gotham Restaurant Backend] Server running on http://localhost:${env.PORT}`);
    console.log(`[Gotham Restaurant Backend] Environment: ${env.NODE_ENV}`);
  });
};

startServer().catch((err) => {
  console.error('[Gotham Restaurant Backend] Fatal startup error:', err);
});

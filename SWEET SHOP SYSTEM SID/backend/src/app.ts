import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { initDatabase } from './database/db';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Initialize database tables
  initDatabase();

  // ✅ ADD THIS ROOT ROUTE HERE
  app.get('/', (req, res) => {
    res.send('Sweet Shop Backend is running 🚀');
  });

  // API routes
  app.use('/api', router);

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
};

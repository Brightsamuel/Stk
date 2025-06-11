import express from 'express';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';
import authRoutes from 'presentation/routes/authRoutes';
import stockRoutes from 'presentation/routes/stockRoutes';
import { connectToDatabase } from 'infrastructure/database/connection';

// Create a base express app to apply middleware
const baseApp = express();
baseApp.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
baseApp.use(express.json());

// Pass the base app to InversifyExpressServer
const server = new InversifyExpressServer(container, null, null, baseApp);
const app = server.build();

const port = 3001; // or 3000 if you want, but make sure it's free

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
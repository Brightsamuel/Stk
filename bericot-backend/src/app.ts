import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1); // Exit the application if the secret is missing
}
import express from 'express';
import cors from 'cors';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';
import { connectToDatabase } from './infrastructure/database/connection';

import './presentation/controllers/authController';
import './presentation/controllers/stockController'; 

async function bootstrap() {
  try {
    await connectToDatabase();
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

    const server = new InversifyExpressServer(container);
    server.setConfig((app) => {
      app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        console.log('Body:', req.body);
        next();
      });
    });

    const app = server.build();
    app.listen(3001, () => {
      console.log('Server running on http://localhost:3001');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
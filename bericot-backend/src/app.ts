import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';
import stockRoutes from './presentation/routes/stockRoutes';
import authRoutes from './presentation/routes/authRoutes';

const app = new InversifyExpressServer(container).build();

app.use(express.json());
app.use('/api/stock', stockRoutes);
app.use('/api/auth', authRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
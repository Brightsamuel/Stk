import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './container';
import stockRoutes from './presentation/routes/stockRoutes';

const app = new InversifyExpressServer(container).build();

app.use(express.json());
app.use('/api/stock', stockRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
import { Router } from 'express';
import { container } from '../../container';
import { StockController } from '../controllers/stockController';

const router = Router();
const stockController = container.get<StockController>(StockController);

router.post('/add', stockController.addStock.bind(stockController));
router.post('/remove', stockController.removeStock.bind(stockController));
router.get('/report/:month/:year', stockController.generateReport.bind(stockController));

export default router;
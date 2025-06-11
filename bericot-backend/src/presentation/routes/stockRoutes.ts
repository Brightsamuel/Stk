import { Router } from 'express';
import { container } from '../../container';
import { StockController } from '../controllers/stockController';
import { authenticateToken } from '../../application/middleware/auth';

const router = Router();
const stockController = container.get<StockController>(StockController);

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.post('/add', stockController.addStock.bind(stockController));
router.post('/remove', stockController.removeStock.bind(stockController));
router.get('/report/:month/:year', stockController.generateReport.bind(stockController));
router.get('/replenishment/:month/:year', stockController.getReplenishmentSuggestions.bind(stockController));
router.get('/all', stockController.getAllStock.bind(stockController));

export default router;
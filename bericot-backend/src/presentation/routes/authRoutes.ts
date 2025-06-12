//authRoutes.ts
import { Router } from 'express';
import { container } from '../../container';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = container.get<AuthController>(AuthController);

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

export default router;
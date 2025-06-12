import { Request, Response, NextFunction } from 'express';
import { container } from '../../container';
import { AuthService } from '../../domain/interfaces/authService';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(`[AuthMiddleware] Token: ${token ? token.substring(0, 20) + '...' : 'No token'}`);

  if (!token) {
    console.log('[AuthMiddleware] No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const authService = container.get<AuthService>('AuthService');
    const userId = await authService.verifyToken(token);
    console.log(`[AuthMiddleware] Token verified for userId: ${userId}`);
    // @ts-ignore
    req.user = { userId };
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Invalid token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
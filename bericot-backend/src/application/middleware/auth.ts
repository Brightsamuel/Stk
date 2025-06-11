import { Request, Response, NextFunction } from 'express';
import { container } from '../../container';
import { AuthService } from '../../domain/interfaces/authService';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const authService = container.get<AuthService>('AuthService');
    await authService.verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
import { User } from '../entities/user';
import jwt from 'jsonwebtoken';

export interface AuthService {
  login(username: string, password: string): Promise<string>;
  register(user: User): Promise<void>;
  verifyToken(token: string): Promise<string>;
}

// Example usage for signing a JWT with env secret:
export function signJwt(user: User): string {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
}
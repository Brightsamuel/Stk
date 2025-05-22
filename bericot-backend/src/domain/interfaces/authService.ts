import { User } from '../entities/user';

export interface AuthService {
  login(username: string, password: string): Promise<string>;
  register(user: User): Promise<void>;
  verifyToken(token: string): Promise<string>;
}
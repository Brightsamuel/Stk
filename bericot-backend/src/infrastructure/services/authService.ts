import { injectable, inject } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/interfaces/userRepository';
import { AuthService } from '../../domain/interfaces/authService';
import { User } from '../../domain/entities/user';

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

@injectable()
export class JwtAuthService implements AuthService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  async login(username: string, password: string): Promise<string> {
    console.log(`[AuthService] Login attempt for: ${username}`);
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      console.log(`[AuthService] User not found: ${username}`);
      throw new Error('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log(`[AuthService] Invalid password for: ${username}`);
      throw new Error('Invalid credentials');
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required but missing.');
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
    console.log(`[AuthService] Token generated for: ${username}`);
    return token;
  }

  async register(user: User): Promise<void> {
    console.log(`[AuthService] Register attempt for: ${user.username}`);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.userRepository.create({ ...user, password: hashedPassword });
    console.log(`[AuthService] User registered: ${user.username}`);
  }

  async verifyToken(token: string): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required but missing.');
    }
    const decoded = jwt.verify(token, secret) as unknown;
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      console.log(`[AuthService] Token verified for userId: ${(decoded as MyJwtPayload).userId}`);
      return (decoded as MyJwtPayload).userId;
    } else {
      console.error('[AuthService] Invalid token payload');
      throw new Error('Invalid token payload: missing userId');
    }
  }
}
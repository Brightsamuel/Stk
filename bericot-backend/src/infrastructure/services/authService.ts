import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/interfaces/userRepository';
import { AuthService } from '../../domain/interfaces/authService';
import { User } from '../../domain/entities/user';

@injectable()
export class JwtAuthService implements AuthService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
  }

  async register(user: User): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.userRepository.create({ ...user, password: hashedPassword });
  }

  async verifyToken(token: string): Promise<string> {
    const decoded = jwt.verify(token, 'your-secret-key') as { userId: string };
    return decoded.userId;
  }
}
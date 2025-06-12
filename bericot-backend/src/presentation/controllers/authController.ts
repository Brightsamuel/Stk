//authController.ts
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { AuthService } from '../../domain/interfaces/authService';

@controller('/api/auth')
export class AuthController {
  constructor(@inject('AuthService') private authService: AuthService) {}

  @httpPost('/login')
  async login(req: Request, res: Response) {
    console.log('=== LOGIN ENDPOINT HIT ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);

    try {
      const { username, password } = req.body;

      // Check if username and password are actually received
      if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ error: 'Username and password required' });
      }

      console.log(`[AuthController] Processing login for: ${username}`);
      const token = await this.authService.login(username, password);

      console.log(`[AuthController] Token generated successfully: ${token.substring(0, 20)}...`);

      res.status(200).json({ token });
    } catch (error) {
      console.error('[AuthController] Login error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  @httpPost('/register')
  async register(req: Request, res: Response) {
    try {
      console.log(`[AuthController] /register endpoint hit for: ${req.body.username}`);
      const { id, username, password } = req.body;
      await this.authService.register({ id: id, username, password });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('[AuthController] Register error:', error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  @httpPost('/test-db')
  async testDb(req: Request, res: Response) {
    try {
      console.log('Testing database connection...');
      // You can change 'testuser' to any username you want to test
      const users = await (this.authService as any).userRepository.findByUsername('testuser');
      console.log('Database test result:', users);
      res.json({ message: 'Database test', users });
    } catch (error: any) {
      console.error('Database test error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
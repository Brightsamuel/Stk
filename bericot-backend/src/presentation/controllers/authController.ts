import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { AuthService } from '../../domain/interfaces/authService';

@controller('/api/auth')
export class AuthController {
  constructor(@inject('AuthService') private authService: AuthService) {}

  @httpPost('/login')
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  @httpPost('/register')
  async register(req: Request, res: Response) {
    try {
      const { id, username, password } = req.body;
      await this.authService.register({ id: id, username, password });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
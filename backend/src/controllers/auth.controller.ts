import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  me(req: Request, res: Response) {
    res.json(req.user);
  },
};

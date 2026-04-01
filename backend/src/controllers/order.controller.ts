import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(
        req.user!.userId,
        req.params['productId'] as string,
      );
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },
};

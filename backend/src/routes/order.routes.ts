import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

export const orderRouter = Router({ mergeParams: true });

orderRouter.post('/:productId/orders', authenticate, orderController.createOrder);

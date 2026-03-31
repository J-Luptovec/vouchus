import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';

export const productRouter = Router();

productRouter.get('/', productController.listProducts);
productRouter.get('/:id', productController.getProduct);
productRouter.post('/', authenticate, productController.createProduct);

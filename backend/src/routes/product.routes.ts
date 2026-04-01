import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { optionalAuthenticate } from '../middleware/auth';

export const productRouter = Router();

productRouter.get('/', productController.listProducts);
productRouter.get('/:id', optionalAuthenticate, productController.getProduct);

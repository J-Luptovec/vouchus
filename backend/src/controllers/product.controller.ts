import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { paginationSchema } from '../validators/product.validator';

export const productController = {
  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const result = await productService.listProducts(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProduct(req.params['id'] as string, req.user?.userId);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
};

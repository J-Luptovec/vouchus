import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/review.service';
import { createReviewSchema } from '../validators/review.validator';
import { paginationSchema } from '../validators/product.validator';

export const reviewController = {
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = paginationSchema.parse(req.query);
      const result = await reviewService.getReviews(req.params['productId'] as string, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createReviewSchema.parse(req.body);
      const review = await reviewService.createReview(
        req.params['productId'] as string,
        req.user!.userId,
        data
      );
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  },

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(req.params['reviewId'] as string, req.user!.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

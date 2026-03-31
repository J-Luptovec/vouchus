import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

export const reviewRouter = Router();

reviewRouter.get('/:productId/reviews', reviewController.getReviews);
reviewRouter.post('/:productId/reviews', authenticate, reviewController.createReview);
reviewRouter.delete('/:productId/reviews/:reviewId', authenticate, reviewController.deleteReview);

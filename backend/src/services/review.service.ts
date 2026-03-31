import { prisma } from '../prisma';
import { CreateReviewInput } from '../validators/review.validator';
import { Prisma } from '@prisma/client';

export const reviewService = {
  async getReviews(productId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, username: true } } },
      }),
      prisma.review.count({ where: { productId } }),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async createReview(productId: string, userId: string, data: CreateReviewInput) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      const err = new Error('Product not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      const err = new Error('You have already reviewed this product') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    const review = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.review.create({
        data: { ...data, userId, productId },
        include: { user: { select: { id: true, username: true } } },
      });

      const { _avg } = await tx.review.aggregate({
        where: { productId },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: productId },
        data: { avgRating: _avg.rating ?? undefined },
      });

      return created;
    });

    return review;
  },

  async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      const err = new Error('Review not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    if (review.userId !== userId) {
      const err = new Error('Forbidden') as Error & { status: number };
      err.status = 403;
      throw err;
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.review.delete({ where: { id: reviewId } });

      const { _avg } = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: { avgRating: _avg.rating ?? null },
      });
    });
  },
};

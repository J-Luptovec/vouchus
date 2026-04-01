import { prisma } from '../prisma';
import { CreateReviewInput } from '../validators/review.validator';
import { Prisma } from '../../generated/prisma/client/client.js';
import { createHttpError } from '../utils/http-error';
import { orderService } from './order.service';

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
    const hasPurchased = await orderService.hasPurchased(userId, productId);
    if (!hasPurchased)
      throw createHttpError(403, 'You must purchase this product before reviewing it');

    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw createHttpError(409, 'You have already reviewed this product');
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw createHttpError(404, 'Product not found');
      }
      throw err;
    }
  },

  async updateReview(reviewId: string, userId: string, data: CreateReviewInput) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw createHttpError(404, 'Review not found');
    if (review.userId !== userId) throw createHttpError(403, 'Forbidden');

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data,
        include: { user: { select: { id: true, username: true } } },
      });

      const { _avg } = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: review.productId },
        data: { avgRating: _avg.rating ?? undefined },
      });

      return updated;
    });
  },

  async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw createHttpError(404, 'Review not found');
    if (review.userId !== userId) throw createHttpError(403, 'Forbidden');

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

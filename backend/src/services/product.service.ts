import { prisma } from '../prisma';
import { createHttpError } from '../utils/http-error';
import { orderService } from './order.service';

export const productService = {
  async listProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { reviews: true } } },
      }),
      prisma.product.count(),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getProduct(id: string, userId?: string) {
    const [product, hasPurchased] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          _count: { select: { reviews: true } },
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { user: { select: { id: true, username: true } } },
          },
        },
      }),
      userId ? orderService.hasPurchased(userId, id) : false,
    ]);

    if (!product) throw createHttpError(404, 'Product not found');
    return { ...product, hasPurchased };
  },
};

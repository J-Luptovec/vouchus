import { prisma } from '../prisma';
import { createHttpError } from '../utils/http-error';

export const orderService = {
  async createOrder(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw createHttpError(404, 'Product not found');

    return prisma.order.create({
      data: { userId, productId, priceAtPurchase: product.price },
      include: { product: { select: { id: true, name: true } } },
    });
  },

  async hasPurchased(userId: string, productId: string) {
    const order = await prisma.order.findFirst({
      where: { userId, productId },
      select: { id: true },
    });
    return order !== null;
  },
};

import { prisma } from '../../src/prisma';
import bcrypt from 'bcrypt';

export async function truncateAll() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Order", "Review", "Product", "User" RESTART IDENTITY CASCADE`,
  );
}

export async function createUser(data?: { username?: string; email?: string; password?: string }) {
  return prisma.user.create({
    data: {
      username: data?.username ?? 'julko',
      email: data?.email ?? 'julko@vouchus.com',
      password: await bcrypt.hash(data?.password ?? 'password123', 10),
    },
  });
}

export async function createProduct(data?: {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
}) {
  return prisma.product.create({
    data: {
      name: data?.name ?? 'Test Product',
      price: data?.price ?? 29.99,
      category: data?.category ?? 'Electronics',
      description: data?.description ?? 'A test product',
    },
  });
}

export async function createOrder(userId: string, productId: string, priceAtPurchase = 29.99) {
  return prisma.order.create({ data: { userId, productId, priceAtPurchase } });
}

export async function createReview(
  userId: string,
  productId: string,
  data?: { rating?: number; body?: string },
) {
  return prisma.review.create({
    data: {
      userId,
      productId,
      rating: data?.rating ?? 4,
      body: data?.body ?? 'Great product!',
      pros: [],
      cons: [],
    },
    include: { user: { select: { id: true, username: true } } },
  });
}

import { prisma } from '../prisma';

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

  async getProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { reviews: true } },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { id: true, username: true } } },
        },
      },
    });
    if (!product) {
      const err = new Error('Product not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return product;
  },
};

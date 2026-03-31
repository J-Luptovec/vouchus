import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  category: z.string().min(1).max(100),
  price: z.number().positive(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

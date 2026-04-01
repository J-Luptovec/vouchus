import { z } from 'zod';
import { REVIEW_CONSTANTS as RC } from '../constants/review.constants';

const proConsItem = z.string().min(RC.PRO_CON_ITEM_MIN_LENGTH).max(RC.PRO_CON_ITEM_MAX_LENGTH);
const proConsList = z.array(proConsItem).max(RC.PRO_CON_MAX_ITEMS).optional().default([]);

export const createReviewSchema = z.object({
  rating: z.number().int().min(RC.RATING_MIN).max(RC.RATING_MAX),
  body: z.string().min(RC.BODY_MIN_LENGTH).max(RC.BODY_MAX_LENGTH),
  pros: proConsList,
  cons: proConsList,
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

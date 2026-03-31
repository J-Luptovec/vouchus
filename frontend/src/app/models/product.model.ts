export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: string;
  price: number;
  avgRating?: number;
  createdAt: string;
  _count?: { reviews: number };
  reviews?: Review[];
}

import { Review } from './review.model';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

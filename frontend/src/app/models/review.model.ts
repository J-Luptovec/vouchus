export interface Review {
  id: string;
  rating: number;
  body: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  user: { id: string; username: string };
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

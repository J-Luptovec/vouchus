import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Review, ReviewsResponse } from '../../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  getReviews(productId: string, page = 1, limit = 10) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ReviewsResponse>(`${environment.apiUrl}/products/${productId}/reviews`, { params });
  }

  createReview(productId: string, rating: number, body: string) {
    return this.http.post<Review>(`${environment.apiUrl}/products/${productId}/reviews`, { rating, body });
  }

  deleteReview(productId: string, reviewId: string) {
    return this.http.delete<void>(`${environment.apiUrl}/products/${productId}/reviews/${reviewId}`);
  }
}

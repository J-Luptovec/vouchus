import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../models/product.model';
import { Review } from '../../../models/review.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ReviewFormComponent } from '../../reviews/review-form/review-form.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    StarRatingComponent,
    ReviewFormComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  readonly auth = inject(AuthService);

  product = signal<Product | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  hasReviewed = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(id).subscribe({
      next: (p: Product) => {
        this.product.set(p);
        this.reviews.set(p.reviews ?? []);
        if (this.auth.currentUser) {
          this.hasReviewed.set(
            p.reviews?.some((r: Review) => r.user.id === this.auth.currentUser!.id) ?? false,
          );
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Product not found.');
        this.loading.set(false);
      },
    });
  }

  onReviewAdded(review: Review) {
    this.reviews.update((prev) => [review, ...prev]);
    this.hasReviewed.set(true);
    const product = this.product();
    if (product) {
      const allRatings = this.reviews().map((r) => r.rating);
      const avg = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
      this.product.set({ ...product, avgRating: avg });
    }
  }

  onReviewDeleted(reviewId: string) {
    this.reviews.update((prev) => prev.filter((r) => r.id !== reviewId));
    this.hasReviewed.set(false);
  }
}

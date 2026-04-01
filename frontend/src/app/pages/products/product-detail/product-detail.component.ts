import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  private reviewService = inject(ReviewService);
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);
  readonly auth = inject(AuthService);

  product = signal<Product | null>(null);
  reviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  hasReviewed = signal(false);
  hasPurchased = computed(() => this.product()?.hasPurchased ?? false);
  buying = signal(false);
  editingReview = signal<Review | null>(null);

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

  onBuy() {
    this.buying.set(true);
    this.orderService.buyProduct(this.product()!.id).subscribe({
      next: () => {
        this.product.update((p) => (p ? { ...p, hasPurchased: true } : p));
        this.buying.set(false);
        this.snackBar.open('Purchase successful!', 'Close', { duration: 3000 });
      },
      error: () => {
        this.buying.set(false);
        this.snackBar.open('Purchase failed. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }

  onReviewAdded(review: Review) {
    this.reviews.update((prev) => [review, ...prev]);
    this.hasReviewed.set(true);
    this.updateAvgRating();
  }

  onReviewUpdated(review: Review) {
    this.reviews.update((prev) => prev.map((r) => (r.id === review.id ? review : r)));
    this.editingReview.set(null);
    this.updateAvgRating();
  }

  onEditReview(review: Review) {
    this.editingReview.set(review);
  }

  onEditCancelled() {
    this.editingReview.set(null);
  }

  onReviewDeleted(reviewId: string) {
    const productId = this.product()!.id;
    this.reviewService.deleteReview(productId, reviewId).subscribe({
      next: () => {
        this.reviews.update((prev) => prev.filter((r) => r.id !== reviewId));
        this.hasReviewed.set(false);
        this.updateAvgRating();
      },
    });
  }

  private updateAvgRating() {
    const product = this.product();
    if (!product) return;
    const allRatings = this.reviews().map((r) => r.rating);
    const avg = allRatings.length ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length : 0;
    this.product.set({ ...product, avgRating: avg || undefined });
  }
}

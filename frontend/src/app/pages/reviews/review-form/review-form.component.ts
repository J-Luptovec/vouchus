import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
})
export class ReviewFormComponent {
  @Input() productId!: string;
  @Output() reviewAdded = new EventEmitter<Review>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);
  hoveredStar = signal(0);

  form = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    body: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
  });

  setRating(value: number) {
    this.form.patchValue({ rating: value });
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const { rating, body } = this.form.value;
    this.reviewService.createReview(this.productId, rating!, body!).subscribe({
      next: (review) => {
        this.reviewAdded.emit(review);
        this.form.reset({ rating: 0, body: '' });
        this.submitting.set(false);
        this.snackBar.open('Review submitted!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        const msg = err.error?.error ?? 'Failed to submit review.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.submitting.set(false);
      },
    });
  }
}

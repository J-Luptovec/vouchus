import { Component, inject, signal, input, output, effect } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../models/review.model';
import { REVIEW_CONSTANTS as RC } from '../../../constants/review.constants';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss',
})
export class ReviewFormComponent {
  productId = input.required<string>();
  editReview = input<Review>();
  reviewAdded = output<Review>();
  reviewUpdated = output<Review>();
  editCancelled = output<void>();

  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);

  submitting = signal(false);
  hoveredStar = signal(0);
  proInput = signal('');
  conInput = signal('');

  readonly RC = RC;

  form = this.fb.group({
    rating: [
      0,
      [Validators.required, Validators.min(RC.RATING_MIN), Validators.max(RC.RATING_MAX)],
    ],
    body: [
      '',
      [
        Validators.required,
        Validators.minLength(RC.BODY_MIN_LENGTH),
        Validators.maxLength(RC.BODY_MAX_LENGTH),
      ],
    ],
    pros: this.fb.array<string>([]),
    cons: this.fb.array<string>([]),
  });

  get prosArray() {
    return this.form.get('pros') as FormArray;
  }
  get consArray() {
    return this.form.get('cons') as FormArray;
  }

  constructor() {
    effect(() => {
      const review = this.editReview();
      this.prosArray.clear();
      this.consArray.clear();
      if (review) {
        this.form.patchValue({ rating: review.rating, body: review.body });
        (review.pros ?? []).forEach((p) => this.prosArray.push(this.fb.control(p)));
        (review.cons ?? []).forEach((c) => this.consArray.push(this.fb.control(c)));
      } else {
        this.form.reset({ rating: 0, body: '' });
      }
    });
  }

  setRating(value: number) {
    this.form.patchValue({ rating: value });
  }

  addItem(input: ReturnType<typeof signal<string>>, array: FormArray) {
    const val = input().trim();
    if (val && array.length < RC.PRO_CON_MAX_ITEMS) {
      array.push(this.fb.control(val));
      input.set('');
    }
  }

  removeItem(array: FormArray, i: number) {
    array.removeAt(i);
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const { rating, body } = this.form.value;
    const pros = this.prosArray.value as string[];
    const cons = this.consArray.value as string[];

    if (this.editReview()) {
      this.reviewService
        .updateReview(this.productId(), this.editReview()!.id, rating!, body!, pros, cons)
        .subscribe({
          next: (review) => {
            this.reviewUpdated.emit(review);
            this.resetForm();
            this.submitting.set(false);
            this.snackBar.open('Review updated!', 'Close', { duration: 3000 });
          },
          error: (err) => {
            const msg = err.error?.error ?? 'Failed to update review.';
            this.snackBar.open(msg, 'Close', { duration: 4000 });
            this.submitting.set(false);
          },
        });
    } else {
      this.reviewService.createReview(this.productId(), rating!, body!, pros, cons).subscribe({
        next: (review) => {
          this.reviewAdded.emit(review);
          this.resetForm();
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

  cancel() {
    this.resetForm();
    this.editCancelled.emit();
  }

  private resetForm() {
    this.form.reset({ rating: 0, body: '' });
    this.prosArray.clear();
    this.consArray.clear();
    this.proInput.set('');
    this.conInput.set('');
  }
}

import { Component, Input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <span class="stars">
      @for (star of stars(); track star) {
        <mat-icon class="star" [class.filled]="star <= rating">star</mat-icon>
      }
    </span>
  `,
  styles: [
    `
      .stars {
        display: inline-flex;
      }
      .star {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--color-star-empty);
      }
      .star.filled {
        color: var(--color-star-filled);
      }
    `,
  ],
})
export class StarRatingComponent {
  @Input() rating = 0;
  stars = signal([1, 2, 3, 4, 5]);
}

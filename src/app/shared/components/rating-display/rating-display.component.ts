import { Component, computed, input } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-rating-display',
  imports: [IconComponent],
  template: `
    <span class="rating" [attr.aria-label]="label()">
      <app-icon name="star" />
      <strong>{{ rating() }}</strong>
      <span>({{ reviewCount() }})</span>
    </span>
  `,
  styles: `
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--rating-color, var(--color-accent));
      font-size: var(--rating-size, 0.85rem);
    }
    span span {
      color: var(--rating-count-color, var(--color-text-secondary));
    }
  `,
})
export class RatingDisplayComponent {
  readonly rating = input.required<number>();
  readonly reviewCount = input.required<number>();
  readonly label = computed(
    () => `التقييم ${this.rating()} من 5 من ${this.reviewCount()} مراجعة`,
  );
}

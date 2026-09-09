import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-price-display',
  imports: [DecimalPipe],
  template: `
    <span class="price">
      @if (oldPrice(); as previous) {
        <s>{{ previous | number: '1.0-0' }}</s>
      }
      <strong [class.price--sale]="!!oldPrice()">{{ price() | number: '1.0-0' }}</strong>
      <span class="price__currency">جنيه</span>
    </span>
  `,
  styles: `
    .price {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.4rem;
    }
    s {
      color: var(--color-text-secondary);
      font-size: 0.85rem;
    }
    strong {
      color: var(--color-text-primary);
      font-size: 1.1rem;
    }
    .price--sale {
      color: var(--color-discount);
    }
    .price__currency {
      color: var(--color-text-secondary);
      font-size: 0.85rem;
    }
  `,
})
export class PriceDisplayComponent {
  readonly price = input.required<number>();
  readonly oldPrice = input<number | undefined>(undefined);
}

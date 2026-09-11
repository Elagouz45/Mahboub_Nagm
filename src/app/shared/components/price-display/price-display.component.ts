import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-price-display',
  imports: [DecimalPipe],
  template: `
    <span class="price">
      <strong [class.price--sale]="!!oldPrice()">{{ price() | number: '1.0-0' }}</strong>
      <span class="price__currency">جنيه</span>
      @if (oldPrice(); as previous) {
        <s>{{ previous | number: '1.0-0' }}</s>
      }
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
      color: var(--price-old-color, var(--color-text-secondary));
      font-size: var(--price-old-size, 0.85rem);
      text-decoration: line-through;
    }
    strong {
      color: var(--price-color, var(--color-text-primary));
      font-size: var(--price-size, 1.1rem);
      font-weight: var(--price-weight, 700);
    }
    .price--sale {
      color: var(--price-sale-color, var(--color-discount));
    }
    .price__currency {
      color: var(--price-currency-color, var(--color-text-secondary));
      font-size: var(--price-currency-size, 0.85rem);
    }
  `,
})
export class PriceDisplayComponent {
  readonly price = input.required<number>();
  readonly oldPrice = input<number | undefined>(undefined);
}

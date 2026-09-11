import { Component, computed, input } from '@angular/core';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { ProductSummary } from '@shared/models/storefront.model';
import { ProductViewMode } from '../../models/catalog.model';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
  host: {
    '[class.product-grid-host--max-3]': 'maxColumns() === 3',
  },
})
export class ProductGridComponent {
  readonly products = input<readonly ProductSummary[]>([]);
  readonly view = input<ProductViewMode>('grid');
  readonly loading = input(false);
  readonly skeletonCount = input(12);
  readonly maxColumns = input<3 | 4>(4);
  readonly skeletons = computed(() => Array.from({ length: this.skeletonCount() }, (_, index) => index));
}

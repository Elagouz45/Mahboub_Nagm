import { Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ProductSort, ProductViewMode, SORT_LABELS } from '../../models/catalog.model';

@Component({
  selector: 'app-products-toolbar',
  imports: [IconComponent],
  templateUrl: './products-toolbar.component.html',
  styleUrl: './products-toolbar.component.scss',
})
export class ProductsToolbarComponent {
  readonly search = input('');
  readonly sort = input<ProductSort>('relevance');
  readonly view = input<ProductViewMode>('grid');
  readonly filterCount = input(0);
  readonly resultRange = input('');
  readonly sorts = SORT_LABELS;
  readonly sortKeys = Object.keys(SORT_LABELS) as ProductSort[];

  readonly searchChange = output<string>();
  readonly sortChange = output<ProductSort>();
  readonly viewChange = output<ProductViewMode>();
  readonly openFilters = output<void>();

  onSortChange(value: string): void {
    this.sortChange.emit(value as ProductSort);
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}

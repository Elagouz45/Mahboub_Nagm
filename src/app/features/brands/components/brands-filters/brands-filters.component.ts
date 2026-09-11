import { Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BrandAlphabetFilterComponent } from '../brand-alphabet-filter/brand-alphabet-filter.component';
import { BRANDS_CATEGORY_FILTERS } from '../../data-access/brands-directory.util';

@Component({
  selector: 'app-brands-filters',
  imports: [IconComponent, BrandAlphabetFilterComponent],
  templateUrl: './brands-filters.component.html',
  styleUrl: './brands-filters.component.scss',
})
export class BrandsFiltersComponent {
  readonly search = input('');
  readonly category = input('');
  readonly letters = input<readonly string[]>([]);
  readonly selectedLetter = input('');
  readonly categories = BRANDS_CATEGORY_FILTERS;

  readonly searchChange = output<string>();
  readonly categoryChange = output<string>();
  readonly letterChange = output<string>();

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.searchChange.emit(target?.value ?? '');
  }

  onCategory(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    this.categoryChange.emit(target?.value ?? '');
  }
}

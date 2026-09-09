import { Component, computed, input, output, signal } from '@angular/core';
import {
  AvailableCatalogFilters,
  CatalogAttributeSelection,
  CatalogFilterState,
  OfferFilter,
  RatingFilter,
} from '../../models/catalog.model';
import { StockStatus } from '@shared/models/storefront.model';
import { FilterGroupComponent } from '../filter-group/filter-group.component';

@Component({
  selector: 'app-product-filters',
  imports: [FilterGroupComponent],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent {
  readonly filters = input.required<CatalogFilterState>();
  readonly available = input.required<AvailableCatalogFilters>();
  readonly filtersChange = output<CatalogFilterState>();

  readonly brandQuery = signal('');
  readonly draftMin = signal('');
  readonly draftMax = signal('');

  readonly filteredBrands = computed(() => {
    const query = this.brandQuery().trim().toLowerCase();
    const brands = this.available().brands;
    if (!query) {
      return brands;
    }
    return brands.filter((brand) => brand.label.toLowerCase().includes(query));
  });

  readonly showBrandSearch = computed(() => this.available().brands.length > 8);

  emit(patch: Partial<CatalogFilterState>): void {
    this.filtersChange.emit({ ...this.filters(), ...patch });
  }

  selectCategory(value: string): void {
    const category = this.filters().category === value ? '' : value;
    this.emit({ category, attributes: category === this.filters().category ? this.filters().attributes : [] });
  }

  toggleBrand(value: string): void {
    const brands = this.filters().brands.includes(value)
      ? this.filters().brands.filter((item) => item !== value)
      : [...this.filters().brands, value];
    this.emit({ brands });
  }

  selectAvailability(value: string): void {
    const typed = value as StockStatus;
    this.emit({ availability: this.filters().availability === typed ? null : typed });
  }

  selectOffer(value: string): void {
    const typed = value as OfferFilter;
    this.emit({ offer: this.filters().offer === typed ? null : typed });
  }

  selectRating(value: string): void {
    const typed = Number(value) as RatingFilter;
    this.emit({ rating: this.filters().rating === typed ? null : typed });
  }

  toggleAttribute(key: string, value: string): void {
    const exists = this.filters().attributes.some((item) => item.key === key && item.value === value);
    const withoutKey = this.filters().attributes.filter((item) => item.key !== key);
    const attributes: CatalogAttributeSelection[] = exists
      ? withoutKey
      : [...withoutKey, { key, value }];
    this.emit({ attributes });
  }

  isAttributeSelected(key: string, value: string): boolean {
    return this.filters().attributes.some((item) => item.key === key && item.value === value);
  }

  isRatingSelected(value: string): boolean {
    return this.filters().rating === Number(value);
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  applyPrice(): void {
    const minRaw =
      this.draftMin().trim() ||
      (this.filters().minPrice !== null ? String(this.filters().minPrice) : '');
    const maxRaw =
      this.draftMax().trim() ||
      (this.filters().maxPrice !== null ? String(this.filters().maxPrice) : '');
    const minPrice = minRaw ? Number(minRaw) : null;
    const maxPrice = maxRaw ? Number(maxRaw) : null;
    this.emit({
      minPrice: minPrice !== null && Number.isFinite(minPrice) ? minPrice : null,
      maxPrice: maxPrice !== null && Number.isFinite(maxPrice) ? maxPrice : null,
    });
  }
}

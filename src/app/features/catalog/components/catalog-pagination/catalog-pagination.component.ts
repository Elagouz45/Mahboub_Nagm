import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CatalogPageSize, PAGE_SIZES } from '../../models/catalog.model';
import { paginationItems } from '../../data-access/catalog-query.util';

@Component({
  selector: 'app-catalog-pagination',
  imports: [IconComponent],
  templateUrl: './catalog-pagination.component.html',
  styleUrl: './catalog-pagination.component.scss',
})
export class CatalogPaginationComponent {
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly pageSize = input<CatalogPageSize>(12);
  readonly disabled = input(false);
  readonly showPageSize = input(true);
  readonly sizeLabel = input('عدد المنتجات');
  readonly pageSizes = PAGE_SIZES;

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<CatalogPageSize>();

  readonly items = computed(() => paginationItems(this.page(), this.totalPages()));

  onPageSize(event: Event): void {
    this.pageSizeChange.emit(Number((event.target as HTMLSelectElement).value) as CatalogPageSize);
  }
}

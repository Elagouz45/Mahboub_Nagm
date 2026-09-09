import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS } from '../../models/catalog.model';

@Component({
  selector: 'app-shop-breadcrumb',
  imports: [RouterLink],
  templateUrl: './shop-breadcrumb.component.html',
  styleUrl: './shop-breadcrumb.component.scss',
})
export class ShopBreadcrumbComponent {
  readonly categorySlug = input('');

  categoryLabel(slug: string): string {
    const labels: Readonly<Record<string, string | undefined>> = CATEGORY_LABELS;
    return labels[slug] ?? slug;
  }
}

import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { Category, SectionState } from '@shared/models/storefront.model';

@Component({
  selector: 'app-category-grid',
  imports: [
    RouterLink,
    EmptyStateComponent,
    ErrorStateComponent,
    IconComponent,
    SectionHeaderComponent,
    SiteImageComponent,
  ],
  templateUrl: './category-grid.component.html',
  styleUrl: './category-grid.component.scss',
})
export class CategoryGridComponent {
  readonly state = input.required<SectionState<readonly Category[]>>();
  readonly retry = output<void>();
  readonly skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
}

import { Component, ElementRef, viewChild, input, output } from '@angular/core';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { SectionHeaderComponent } from '@shared/components/section-header/section-header.component';
import { ProductSummary, SectionState } from '@shared/models/storefront.model';

@Component({
  selector: 'app-best-sellers-section',
  imports: [
    IconComponent,
    ProductCardComponent,
    SectionHeaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './best-sellers-section.component.html',
  styleUrl: './best-sellers-section.component.scss',
})
export class BestSellersSectionComponent {
  readonly state = input.required<SectionState<readonly ProductSummary[]>>();
  readonly retry = output<void>();
  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  scroll(direction: 1 | -1): void {
    const el = this.scroller()?.nativeElement;
    if (!el) {
      return;
    }
    const rtl = getComputedStyle(el).direction === 'rtl';
    const delta = el.clientWidth * 0.8 * direction * (rtl ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }
}

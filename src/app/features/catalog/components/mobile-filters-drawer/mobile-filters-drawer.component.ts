import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { AvailableCatalogFilters, CatalogFilterState } from '../../models/catalog.model';
import { ProductFiltersComponent } from '../product-filters/product-filters.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-mobile-filters-drawer',
  imports: [ProductFiltersComponent, IconComponent],
  templateUrl: './mobile-filters-drawer.component.html',
  styleUrl: './mobile-filters-drawer.component.scss',
  host: {
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class MobileFiltersDrawerComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  readonly open = input(false);
  readonly filters = input.required<CatalogFilterState>();
  readonly available = input.required<AvailableCatalogFilters>();
  readonly resultCount = input(0);

  readonly closed = output<void>();
  readonly apply = output<void>();
  readonly clearDraft = output<void>();
  readonly filtersChange = output<CatalogFilterState>();

  constructor() {
    effect(() => {
      if (this.open()) {
        this.lockScroll();
        queueMicrotask(() => this.focusFirst());
      } else {
        this.unlockScroll();
      }
    });

    this.destroyRef.onDestroy(() => this.unlockScroll());
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      this.closed.emit();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const nodes = this.focusables();
    if (nodes.length === 0) {
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = this.document.activeElement;
    if (event.shiftKey && active === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && active === last) {
      first.focus();
      event.preventDefault();
    }
  }

  private focusables(): HTMLElement[] {
    const root = this.panel()?.nativeElement;
    if (!root) {
      return [];
    }
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
  }

  private focusFirst(): void {
    this.focusables()[0]?.focus();
  }

  private lockScroll(): void {
    this.document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    this.document.body.style.overflow = '';
  }
}

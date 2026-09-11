import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { ProductSummary, SectionState } from '@shared/models/storefront.model';

@Component({
  selector: 'app-best-sellers-section',
  imports: [
    RouterLink,
    IconComponent,
    ProductCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './best-sellers-section.component.html',
  styleUrl: './best-sellers-section.component.scss',
})
export class BestSellersSectionComponent {
  readonly state = input.required<SectionState<readonly ProductSummary[]>>();
  readonly retry = output<void>();
  private readonly host = inject(ElementRef);
  private readonly scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly canPrev = signal(false);
  readonly canNext = signal(false);
  readonly showControls = signal(false);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    effect((onCleanup) => {
      this.state();
      const el = this.scrollerElement();
      if (!el) {
        this.showControls.set(false);
        this.canPrev.set(false);
        this.canNext.set(false);
        return;
      }

      const onScroll = () => this.updateScrollState();
      const observer = new ResizeObserver(onScroll);
      observer.observe(el);
      this.updateScrollState();
      const frame = globalThis.requestAnimationFrame(() => this.updateScrollState());
      el.addEventListener('scroll', onScroll, { passive: true });
      globalThis.addEventListener('resize', onScroll);
      onCleanup(() => {
        observer.disconnect();
        globalThis.cancelAnimationFrame(frame);
        el.removeEventListener('scroll', onScroll);
        globalThis.removeEventListener('resize', onScroll);
      });
    });

    afterNextRender(() => this.updateScrollState());
  }

  scroll(direction: 1 | -1): void {
    const el = this.scrollerElement();
    if (!el) {
      return;
    }
    const rtl = getComputedStyle(el).direction === 'rtl';
    const card = el.querySelector('app-product-card');
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 22;
    const width = card instanceof HTMLElement ? card.getBoundingClientRect().width : el.clientWidth * 0.25;
    const delta = (width + gap) * direction * (rtl ? -1 : 1);
    el.scrollLeft += delta;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.scroll(1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.scroll(-1);
      event.preventDefault();
    }
  }

  private scrollerElement(): HTMLDivElement | undefined {
    const fromRef = this.scroller()?.nativeElement;
    if (fromRef) {
      return fromRef;
    }

    const fallback = this.host.nativeElement.querySelector('.best-sellers__row[tabindex]');
    return fallback instanceof HTMLDivElement ? fallback : undefined;
  }

  private updateScrollState(): void {
    const el = this.scrollerElement();
    if (!el) {
      this.showControls.set(false);
      this.canPrev.set(false);
      this.canNext.set(false);
      return;
    }

    const max = el.scrollWidth - el.clientWidth;
    const offset = Math.abs(el.scrollLeft);
    const overflowing = max > 4;
    this.showControls.set(overflowing);
    this.canPrev.set(overflowing && offset > 4);
    this.canNext.set(overflowing && offset < max - 4);
  }
}

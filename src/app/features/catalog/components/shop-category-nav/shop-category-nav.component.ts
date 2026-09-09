import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SHOP_CATEGORY_STRIP } from '@core/constants/app.constants';
import { IconComponent } from '@shared/components/icon/icon.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { CATALOG_CATEGORY_IMAGE_BY_SLUG } from '../../data-access/catalog-image.map';

@Component({
  selector: 'app-shop-category-nav',
  imports: [IconComponent, SiteImageComponent],
  templateUrl: './shop-category-nav.component.html',
  styleUrl: './shop-category-nav.component.scss',
  host: {
    id: 'shop-categories',
  },
})
export class ShopCategoryNavComponent {
  private readonly document = inject(DOCUMENT);
  private readonly strip = viewChild<ElementRef<HTMLElement>>('strip');

  readonly selected = input('');
  readonly categoryChange = output<string>();

  readonly items = SHOP_CATEGORY_STRIP;
  readonly imageBySlug = CATALOG_CATEGORY_IMAGE_BY_SLUG;
  readonly imageSizes = '(max-width: 767px) 22vw, 5rem';
  readonly canScroll = signal(false);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const el = this.strip()?.nativeElement;
      const view = this.document.defaultView;
      if (
        !isPlatformBrowser(platformId) ||
        !el ||
        !view ||
        typeof view.ResizeObserver !== 'function'
      ) {
        return;
      }

      const update = () => this.canScroll.set(el.scrollWidth > el.clientWidth + 1);
      const observer = new view.ResizeObserver(update);
      observer.observe(el);
      el.addEventListener('scroll', update, { passive: true });
      update();
      destroyRef.onDestroy(() => {
        observer.disconnect();
        el.removeEventListener('scroll', update);
      });
    });
  }

  select(slug: string): void {
    this.categoryChange.emit(slug);
  }

  scrollStrip(direction: -1 | 1): void {
    const el = this.strip()?.nativeElement;
    if (!el) {
      return;
    }
    const rtl = this.document.documentElement.dir === 'rtl';
    const distance = Math.round(el.clientWidth * 0.7) * direction * (rtl ? 1 : -1);
    const view = this.document.defaultView;
    const reduce =
      !view ||
      typeof view.matchMedia !== 'function' ||
      view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: distance, behavior: reduce ? 'auto' : 'smooth' });
  }
}

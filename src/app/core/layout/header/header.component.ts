import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import {
  APP_NAME_SHORT,
  APP_SLOGAN,
  MAIN_NAV_LINKS,
  NavLink,
} from '@core/constants/app.constants';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { ACCOUNT_NAV_LINKS } from '@features/account/account-nav';
import { BrandLogoComponent } from '@shared/components/brand-logo/brand-logo.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { filter, map, startWith } from 'rxjs';

const SHOP_ACTIVE_OPTIONS: IsActiveMatchOptions = {
  paths: 'subset',
  queryParams: 'ignored',
  fragment: 'ignored',
  matrixParams: 'ignored',
};

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, BrandLogoComponent, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.is-scrolled]': 'isScrolled()',
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly cartBadge = inject(CART_PORT, { optional: true });
  private readonly wishlistBadge = inject(WISHLIST_PORT, { optional: true });
  private readonly drawer = viewChild<ElementRef<HTMLElement>>('drawer');
  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly accountMenuRoot = viewChild<ElementRef<HTMLElement>>('accountMenuRoot');
  private readonly accountToggle = viewChild<ElementRef<HTMLButtonElement>>('accountToggle');
  private menuTrigger: HTMLElement | null = null;
  private accountTrigger: HTMLElement | null = null;

  readonly shortName = APP_NAME_SHORT;
  readonly slogan = APP_SLOGAN;
  readonly navLinks = MAIN_NAV_LINKS;
  readonly searchQuery = signal('');
  readonly menuOpen = signal(false);
  readonly isScrolled = signal(false);
  readonly compactNav = signal(false);
  readonly cartCount = computed(() => this.cartBadge?.count() ?? 0);
  readonly wishlistCount = computed(() => this.wishlistBadge?.count() ?? 0);
  readonly user = this.auth.user;
  readonly firstName = this.auth.firstName;
  readonly initial = this.auth.initial;
  readonly authInitialized = this.auth.authInitialized;
  readonly accountNav = ACCOUNT_NAV_LINKS;
  readonly accountMenuOpen = signal(false);
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly shopActive = computed(() => {
    this.currentUrl();
    return this.router.isActive(this.router.createUrlTree(['/products']), SHOP_ACTIVE_OPTIONS);
  });

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const view = this.document.defaultView;
    if (!isPlatformBrowser(platformId) || !view) {
      return;
    }

    const onScroll = () => this.isScrolled.set(view.scrollY > 8);
    onScroll();
    view.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => view.removeEventListener('scroll', onScroll));

    if (typeof view.matchMedia === 'function') {
      const media = view.matchMedia('(max-width: 767px)');
      this.compactNav.set(media.matches);
      const onChange = () => {
        this.compactNav.set(media.matches);
        if (!media.matches) {
          this.closeMenus();
        } else {
          this.closeAccountMenu();
        }
      };
      media.addEventListener('change', onChange);
      this.destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
    }

    effect(() => {
      if (this.menuOpen()) {
        this.document.body.style.overflow = 'hidden';
        queueMicrotask(() => this.focusFirstInDrawer());
      } else {
        this.document.body.style.overflow = '';
      }
    });

    this.destroyRef.onDestroy(() => {
      this.document.body.style.overflow = '';
    });
  }

  isShopLink(link: NavLink): boolean {
    return link.path === '/products' && !link.queryParams;
  }

  navActiveOptions(link: NavLink): { exact: boolean } | IsActiveMatchOptions {
    if (link.exact) {
      return { exact: true };
    }
    if (link.queryParams) {
      return {
        paths: 'exact',
        queryParams: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored',
      };
    }
    return { exact: false };
  }

  badgeLabel(count: number): string {
    return count > 99 ? '99+' : String(count);
  }

  onSearchInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchQuery.set(target.value);
    }
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery().trim();
    void this.router.navigate(['/products'], { queryParams: query ? { q: query } : {} });
    this.closeMenus();
  }

  toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenus();
      return;
    }
    this.menuTrigger = this.document.activeElement as HTMLElement | null;
    this.menuOpen.set(true);
  }

  closeMenus(): void {
    this.closeAccountMenu();
    if (!this.menuOpen()) {
      return;
    }
    this.menuOpen.set(false);
    queueMicrotask(() => (this.menuTrigger ?? this.menuToggle()?.nativeElement)?.focus());
  }

  onAccountAction(event: Event): void {
    event.stopPropagation();
    if (this.compactNav()) {
      this.closeMenus();
      void this.router.navigateByUrl(this.user() ? '/account' : '/login');
      return;
    }
    this.toggleAccountMenu();
  }

  toggleAccountMenu(): void {
    if (this.accountMenuOpen()) {
      this.closeAccountMenu();
      return;
    }
    this.accountTrigger = this.document.activeElement as HTMLElement | null;
    this.accountMenuOpen.set(true);
  }

  closeAccountMenu(): void {
    if (!this.accountMenuOpen()) {
      return;
    }
    this.accountMenuOpen.set(false);
    queueMicrotask(() => (this.accountTrigger ?? this.accountToggle()?.nativeElement)?.focus());
  }

  onDocumentClick(event: Event): void {
    if (!this.accountMenuOpen()) {
      return;
    }
    const root = this.accountMenuRoot()?.nativeElement;
    if (root && event.target instanceof Node && !root.contains(event.target)) {
      this.closeAccountMenu();
    }
  }

  async logout(): Promise<void> {
    this.closeMenus();
    await this.auth.logout();
    this.toast.show(AUTH_COPY.logoutSuccess);
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.accountMenuOpen() && event.key === 'Escape') {
      this.closeAccountMenu();
      return;
    }
    if (!this.menuOpen()) {
      return;
    }
    if (event.key === 'Escape') {
      this.closeMenus();
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
    const root = this.drawer()?.nativeElement;
    if (!root) {
      return [];
    }
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
  }

  private focusFirstInDrawer(): void {
    this.focusables()[0]?.focus();
  }
}

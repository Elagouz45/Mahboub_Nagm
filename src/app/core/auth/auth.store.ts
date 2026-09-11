import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { BrowserStorageService } from '@core/services/browser-storage.service';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { MOCK_CATALOG_PRODUCTS } from '@features/catalog/data-access/catalog-mock.service';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { AUTH_STORAGE_KEYS, DEMO_USER_ID } from './auth.constants';
import {
  AuthError,
  AuthUser,
  ChangePasswordRequest,
  isAuthError,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from './auth.models';
import { AuthRepository } from './auth.repository';
import { DEMO_WISHLIST_PRODUCT_IDS } from './demo-seed';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly commerce = inject(DemoCommerceService);
  private readonly repository = inject(AuthRepository);
  private readonly wishlist = inject(WishlistStore);
  private readonly storage = inject(BrowserStorageService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private restorePromise: Promise<void> | null = null;

  private readonly userState = signal<AuthUser | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly initializedState = signal(false);

  readonly user = this.userState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly lastError = this.errorState.asReadonly();
  readonly authInitialized = this.initializedState.asReadonly();
  readonly isAuthenticated = computed(() => this.userState() !== null);
  readonly firstName = computed(() => this.userState()?.firstName ?? '');
  readonly displayName = computed(() => {
    const current = this.userState();
    return current ? `${current.firstName} ${current.lastName}`.trim() : '';
  });
  readonly initial = computed(() => this.firstName().charAt(0) || 'م');

  constructor() {
    afterNextRender(() => {
      void this.restoreSession();
    });
  }

  restoreSession(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.resolve();
    }
    this.restorePromise ??= this.repository
      .restoreSession()
      .then((user) => {
        this.commerce.switchUser(user?.id ?? null);
        this.userState.set(user);
      })
      .catch(() => {
        this.userState.set(null);
      })
      .finally(() => {
        this.initializedState.set(true);
      });
    return this.restorePromise;
  }

  async login(request: LoginRequest): Promise<AuthUser> {
    return this.run(
      () => this.repository.login(request),
      async (user) => {
        this.maybeSeedDemoWishlist(user.id);
        return user;
      },
    );
  }

  async register(request: RegisterRequest): Promise<AuthUser> {
    return this.run(() => this.repository.register(request));
  }

  async logout(): Promise<void> {
    await this.repository.logout();
    this.commerce.switchUser(null);
    this.userState.set(null);
    this.errorState.set(null);
    this.restorePromise = Promise.resolve();
    this.initializedState.set(true);
  }

  async updateProfile(request: UpdateProfileRequest): Promise<AuthUser> {
    const current = this.userState();
    if (!current) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unauthorized);
    }
    return this.run(() => this.repository.updateProfile(current.id, request));
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const current = this.userState();
    if (!current) {
      throw new AuthError('unknown', USER_ERROR_MESSAGES.unauthorized);
    }
    this.errorState.set(null);
    try {
      await this.repository.changePassword(current.id, request);
    } catch (error) {
      const message = isAuthError(error) ? error.message : USER_ERROR_MESSAGES.unknown;
      this.errorState.set(message);
      throw error instanceof AuthError ? error : new AuthError('unknown', message);
    }
  }

  private async run<T extends AuthUser>(
    operation: () => Promise<T>,
    after?: (value: T) => Promise<T> | T,
  ): Promise<T> {
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      const value = await operation();
      this.commerce.switchUser(value.id);
      const next = after ? await after(value) : value;
      this.userState.set(next);
      return next;
    } catch (error) {
      const message = isAuthError(error) ? error.message : USER_ERROR_MESSAGES.unknown;
      this.errorState.set(message);
      throw error instanceof AuthError ? error : new AuthError('unknown', message);
    } finally {
      this.loadingState.set(false);
    }
  }

  private maybeSeedDemoWishlist(userId: string): void {
    if (userId !== DEMO_USER_ID) {
      return;
    }
    const seeded = this.storage.readLocalJson<{ schemaVersion: number; seeded: boolean }>(
      AUTH_STORAGE_KEYS.wishlistSeeded,
    );
    if (seeded?.seeded) {
      return;
    }
    if (this.wishlist.count() > 0) {
      this.storage.writeLocalJson(AUTH_STORAGE_KEYS.wishlistSeeded, {
        schemaVersion: 1,
        seeded: true,
      });
      return;
    }
    for (const productId of DEMO_WISHLIST_PRODUCT_IDS) {
      const product = MOCK_CATALOG_PRODUCTS.find((item) => item.id === productId);
      if (product && !this.wishlist.ids().has(product.id)) {
        this.wishlist.toggle(product);
      }
    }
    this.storage.writeLocalJson(AUTH_STORAGE_KEYS.wishlistSeeded, {
      schemaVersion: 1,
      seeded: true,
    });
  }
}

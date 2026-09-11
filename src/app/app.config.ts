import { IMAGE_CONFIG } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { SITE_CONTACT, SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { apiBaseUrlInterceptor } from '@core/interceptors/api-base-url.interceptor';
import { apiErrorInterceptor } from '@core/interceptors/api-error.interceptor';
import { API_BASE_URL, WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { AppTitleStrategy } from '@core/utils/app-title.strategy';
import { provideDocumentLanguage } from '@core/utils/document-lang';
import { provideAuth } from '@core/auth/provide-auth';
import { AuthStore } from '@core/auth/auth.store';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideDocumentLanguage(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: WHATSAPP_NUMBER, useValue: environment.whatsappNumber },
    { provide: SITE_CONTACT_CONFIG, useValue: SITE_CONTACT },
    { provide: CART_PORT, useExisting: CartStore },
    { provide: WISHLIST_PORT, useExisting: WishlistStore },
    ...provideAuth(),
    provideAppInitializer(() => inject(AuthStore).restoreSession()),
    provideHttpClient(withFetch(), withInterceptors([apiBaseUrlInterceptor, apiErrorInterceptor])),
    provideClientHydration(withEventReplay()),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
      },
    },
  ],
};

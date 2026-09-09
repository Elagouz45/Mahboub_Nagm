import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guards';
import { unsavedChangesGuard } from '@core/auth/unsaved-changes.guard';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/account-layout/account-layout.component').then((m) => m.AccountLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/account-overview-page/account-overview-page.component').then(
            (m) => m.AccountOverviewPageComponent,
          ),
        title: 'حسابي',
      },
      {
        path: 'profile',
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/account-profile-page/account-profile-page.component').then(
            (m) => m.AccountProfilePageComponent,
          ),
        title: 'الملف الشخصي',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/account-orders-page/account-orders-page.component').then(
            (m) => m.AccountOrdersPageComponent,
          ),
        title: 'طلباتي',
      },
      {
        path: 'orders/:orderId',
        loadComponent: () =>
          import('./pages/account-order-detail-page/account-order-detail-page.component').then(
            (m) => m.AccountOrderDetailPageComponent,
          ),
        title: 'تفاصيل الطلب',
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./pages/account-addresses-page/account-addresses-page.component').then(
            (m) => m.AccountAddressesPageComponent,
          ),
        title: 'العناوين',
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/account-wishlist-page/account-wishlist-page.component').then(
            (m) => m.AccountWishlistPageComponent,
          ),
        title: 'المفضلة',
      },
      {
        path: 'service-requests',
        loadComponent: () =>
          import('./pages/account-service-requests-page/account-service-requests-page.component').then(
            (m) => m.AccountServiceRequestsPageComponent,
          ),
        title: 'طلبات الصيانة',
      },
    ],
  },
];

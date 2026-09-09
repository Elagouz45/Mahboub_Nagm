import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.routes').then((routes) => routes.HOME_ROUTES),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./features/catalog/catalog.routes').then((routes) => routes.CATALOG_ROUTES),
          },
          {
            path: ':slug',
            loadChildren: () =>
              import('./features/product/product.routes').then((routes) => routes.PRODUCT_ROUTES),
          },
        ],
      },
      {
        path: 'shop',
        pathMatch: 'full',
        redirectTo: ({ queryParams }) =>
          inject(Router).createUrlTree(['/products'], { queryParams }),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then((routes) => routes.CART_ROUTES),
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./features/wishlist/wishlist.routes').then((routes) => routes.WISHLIST_ROUTES),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then((routes) => routes.CHECKOUT_ROUTES),
      },
      {
        path: 'brands',
        loadChildren: () =>
          import('./features/brands/brands.routes').then((routes) => routes.BRANDS_ROUTES),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./features/offers/offers.routes').then((routes) => routes.OFFERS_ROUTES),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.routes').then((routes) => routes.ABOUT_ROUTES),
      },
      {
        path: 'after-sales',
        loadChildren: () =>
          import('./features/after-sales/after-sales.routes').then((routes) => routes.AFTER_SALES_ROUTES),
      },
      {
        path: 'service-centers',
        loadChildren: () =>
          import('./features/service-centers/service-centers.routes').then(
            (routes) => routes.SERVICE_CENTERS_ROUTES,
          ),
      },
      {
        path: 'return-policy',
        loadChildren: () =>
          import('./features/policies/policies.routes').then((routes) => routes.RETURN_POLICY_ROUTES),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./features/policies/policies.routes').then((routes) => routes.PRIVACY_POLICY_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((routes) => routes.AUTH_ROUTES),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./features/account/account.routes').then((routes) => routes.ACCOUNT_ROUTES),
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.routes').then((routes) => routes.CONTACT_ROUTES),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./core/pages/not-found-page/not-found-page.component').then(
            (m) => m.NotFoundPageComponent,
          ),
        title: 'الصفحة غير موجودة',
      },
    ],
  },
];

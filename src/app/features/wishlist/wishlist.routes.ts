import { Routes } from '@angular/router';

export const WISHLIST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/wishlist-page/wishlist-page.component').then((m) => m.WishlistPageComponent),
    title: 'المفضلة',
  },
];

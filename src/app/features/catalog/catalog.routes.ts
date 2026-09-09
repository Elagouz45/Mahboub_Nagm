import { Routes } from '@angular/router';
import { CatalogMockService } from './data-access/catalog-mock.service';
import { CatalogRepository } from './data-access/catalog.repository';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shop-page/shop-page.component').then((m) => m.ShopPageComponent),
    title: 'المتجر',
    providers: [
      CatalogMockService,
      { provide: CatalogRepository, useExisting: CatalogMockService },
    ],
  },
];

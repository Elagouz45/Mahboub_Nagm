import { Routes } from '@angular/router';
import { CatalogMockService } from '@features/catalog/data-access/catalog-mock.service';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
import { OffersCatalogRepository } from './data-access/offers-catalog.repository';
import { OffersRepository } from './data-access/offers.repository';

export const OFFERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/offers-page/offers-page.component').then((m) => m.OffersPageComponent),
    title: 'العروض',
    providers: [
      CatalogMockService,
      { provide: CatalogRepository, useExisting: CatalogMockService },
      { provide: OffersRepository, useClass: OffersCatalogRepository },
    ],
  },
];

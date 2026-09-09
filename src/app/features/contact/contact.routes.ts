import { Routes } from '@angular/router';
import { CatalogMockService } from '@features/catalog/data-access/catalog-mock.service';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
import { ContactUnavailableRepository } from './data-access/contact-unavailable.repository';
import { ContactRepository } from './data-access/contact.repository';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
    title: 'تواصل معنا',
    providers: [
      CatalogMockService,
      { provide: CatalogRepository, useExisting: CatalogMockService },
      { provide: ContactRepository, useClass: ContactUnavailableRepository },
    ],
  },
];

import { Routes } from '@angular/router';
import { CatalogMockService } from '@features/catalog/data-access/catalog-mock.service';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
import { ContactLocalRepository } from './data-access/contact-local.repository';
import { ContactRepository } from './data-access/contact.repository';

export const CONTACT_ROUTES: Routes = [
  {
    path: 'requests/:reference',
    loadComponent: () =>
      import('./pages/contact-receipt-page.component').then((m) => m.ContactReceiptPageComponent),
    title: 'تفاصيل الرسالة التجريبية',
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then((m) => m.ContactPageComponent),
    title: 'تواصل معنا',
    providers: [
      CatalogMockService,
      { provide: CatalogRepository, useExisting: CatalogMockService },
      { provide: ContactRepository, useClass: ContactLocalRepository },
    ],
  },
];

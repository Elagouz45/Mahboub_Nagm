import { Routes } from '@angular/router';
import { BrandsMockRepository } from './data-access/brands-mock.repository';
import { BrandsRepository } from './data-access/brands.repository';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/brands-page/brands-page.component').then((m) => m.BrandsPageComponent),
    title: 'العلامات التجارية',
    providers: [{ provide: BrandsRepository, useClass: BrandsMockRepository }],
  },
];

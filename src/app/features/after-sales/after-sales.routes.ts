import { Routes } from '@angular/router';

export const AFTER_SALES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/after-sales-page/after-sales-page.component').then(
        (m) => m.AfterSalesPageComponent,
      ),
    title: 'خدمات ما بعد البيع',
  },
];

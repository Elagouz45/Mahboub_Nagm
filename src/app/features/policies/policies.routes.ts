import { Routes } from '@angular/router';

export const RETURN_POLICY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/return-policy-page/return-policy-page.component').then(
        (m) => m.ReturnPolicyPageComponent,
      ),
    title: 'الاستبدال والاسترجاع',
  },
];

export const PRIVACY_POLICY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/privacy-policy-page/privacy-policy-page.component').then(
        (m) => m.PrivacyPolicyPageComponent,
      ),
    title: 'سياسة الخصوصية',
  },
];

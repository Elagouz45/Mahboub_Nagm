import { Routes } from '@angular/router';
import { guestGuard } from '@core/auth/auth.guards';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    title: 'تسجيل الدخول',
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then((m) => m.RegisterPageComponent),
    title: 'إنشاء حساب',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

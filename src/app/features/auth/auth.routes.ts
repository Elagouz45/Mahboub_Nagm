import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { guestGuard } from '@core/auth/auth.guards';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
    title: 'تسجيل الدخول',
  },
];

export const REGISTER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then((m) => m.RegisterPageComponent),
    title: 'إنشاء حساب جديد',
  },
];

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    redirectTo: ({ queryParams }) => inject(Router).createUrlTree(['/login'], { queryParams }),
  },
  {
    path: 'register',
    redirectTo: ({ queryParams }) => inject(Router).createUrlTree(['/register'], { queryParams }),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => inject(Router).createUrlTree(['/login']),
  },
];

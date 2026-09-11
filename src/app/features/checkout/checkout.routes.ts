import { Routes } from '@angular/router';
export const CHECKOUT_ROUTES: Routes = [
  {
    path: 'confirmation/:orderId',
    loadComponent: () =>
      import('./pages/order-confirmation-page.component').then(
        (m) => m.OrderConfirmationPageComponent,
      ),
    title: 'تأكيد الطلب التجريبي',
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/checkout-page/checkout-page.component').then((m) => m.CheckoutPageComponent),
    title: 'إتمام الطلب',
  },
];

import { Routes } from '@angular/router';
import { ServiceCentersMockRepository } from './data-access/service-centers-mock.repository';
import { ServiceCentersRepository } from './data-access/service-centers.repository';

export const SERVICE_CENTERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/service-centers-page/service-centers-page.component').then(
        (m) => m.ServiceCentersPageComponent,
      ),
    title: 'مراكز الصيانة',
    providers: [{ provide: ServiceCentersRepository, useClass: ServiceCentersMockRepository }],
  },
];

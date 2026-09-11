import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api',
  whatsappNumber: '',
  /** Local mock auth is for `ng serve` only. Production uses the API adapter. */
  useMockAuth: false,
  showDemoCredentials: false,
};

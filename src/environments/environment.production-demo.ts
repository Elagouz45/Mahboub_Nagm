import { AppEnvironment } from './environment.model';

/** Contabo/static demo: mock auth, no live API backend. */
export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl: '/api',
  whatsappNumber: '',
  useMockAuth: true,
  showDemoCredentials: true,
};

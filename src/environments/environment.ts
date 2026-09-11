import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
  whatsappNumber: '',
  /** Local demo auth only. Set false to use ApiAuthRepository against apiBaseUrl. */
  useMockAuth: true,
  showDemoCredentials: true,
};

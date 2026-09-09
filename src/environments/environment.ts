import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
  whatsappNumber: '',
  useMockAuth: true,
  showDemoCredentials: true,
};

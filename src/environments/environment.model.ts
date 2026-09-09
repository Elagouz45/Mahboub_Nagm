export interface AppEnvironment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly whatsappNumber: string;
  readonly useMockAuth: boolean;
  readonly showDemoCredentials: boolean;
}

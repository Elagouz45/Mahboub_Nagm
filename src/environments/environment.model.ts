export interface AppEnvironment {
  readonly production: boolean;
  readonly apiBaseUrl: string;
  readonly whatsappNumber: string;
  /** When true, AuthStore uses LocalDemoAuthRepository (browser storage). */
  readonly useMockAuth: boolean;
  readonly showDemoCredentials: boolean;
}

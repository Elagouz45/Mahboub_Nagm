export const AUTH_SCHEMA_VERSION = 1;

export interface PasswordSecret {
  readonly algo: 'PBKDF2';
  readonly iterations: number;
  readonly salt: string;
  readonly hash: string;
}

export interface AuthUser {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly createdAt: number;
}

export interface StoredAuthUser extends AuthUser {
  readonly password: PasswordSecret;
}

export interface AuthSession {
  readonly schemaVersion: number;
  readonly userId: string;
}

export interface LoginRequest {
  readonly identifier: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
  readonly password: string;
}

export interface UpdateProfileRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
}

export type AuthErrorCode =
  | 'invalid-credentials'
  | 'duplicate-email'
  | 'duplicate-phone'
  | 'unavailable'
  | 'unknown';

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function isAuthError(value: unknown): value is AuthError {
  return value instanceof AuthError;
}

export interface VersionedList<T> {
  readonly schemaVersion: number;
  readonly items: readonly T[];
}

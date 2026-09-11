import { Injectable } from '@angular/core';
import {
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from './auth.models';

/**
 * Auth adapter used by AuthStore and pages.
 * Swap LocalDemoAuthRepository → ApiAuthRepository via environment.useMockAuth.
 * Do not put login/register HTTP or storage logic in components.
 */
@Injectable()
export abstract class AuthRepository {
  abstract ensureReady(): Promise<void>;
  abstract restoreSession(): Promise<AuthUser | null>;
  abstract login(request: LoginRequest): Promise<AuthUser>;
  abstract register(request: RegisterRequest): Promise<AuthUser>;
  abstract logout(): Promise<void>;
  abstract updateProfile(userId: string, request: UpdateProfileRequest): Promise<AuthUser>;
  abstract changePassword(userId: string, request: ChangePasswordRequest): Promise<void>;
}

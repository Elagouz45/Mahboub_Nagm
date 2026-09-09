import { Injectable } from '@angular/core';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from './auth.models';

@Injectable()
export abstract class AuthRepository {
  abstract ensureReady(): Promise<void>;
  abstract restoreSession(): Promise<AuthUser | null>;
  abstract login(request: LoginRequest): Promise<AuthUser>;
  abstract register(request: RegisterRequest): Promise<AuthUser>;
  abstract logout(): Promise<void>;
  abstract updateProfile(userId: string, request: UpdateProfileRequest): Promise<AuthUser>;
}

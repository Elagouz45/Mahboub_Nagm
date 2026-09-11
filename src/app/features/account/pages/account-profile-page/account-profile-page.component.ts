import { Component, computed, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { isAuthError } from '@core/auth/auth.models';
import { AuthStore } from '@core/auth/auth.store';
import { CanDeactivateDirty } from '@core/auth/unsaved-changes.guard';
import { ToastService } from '@core/services/toast.service';
import { EMAIL_PATTERN } from '@core/utils/email.util';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';
import { isValidPassword } from '@core/utils/password.util';
import { IconComponent } from '@shared/components/icon/icon.component';
import { matchControl } from '@features/auth/auth.validators';

type ProfileField = 'firstName' | 'lastName' | 'phone' | 'email';
type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';
type PasswordVisibility = 'current' | 'next' | 'confirm';

@Component({
  selector: 'app-account-profile-page',
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './account-profile-page.component.html',
  styleUrl: './account-profile-page.component.scss',
})
export class AccountProfilePageComponent implements CanDeactivateDirty {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly user = this.auth.user;
  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly profileError = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  readonly initials = computed(() => {
    const current = this.user();
    if (!current) {
      return 'م';
    }
    return `${current.firstName.charAt(0)}${current.lastName.charAt(0)}`.trim() || 'م';
  });

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, egyptianPhoneControl]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, passwordControl]],
    confirmPassword: ['', [Validators.required, matchControl('newPassword')]],
  });

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      });
    }
    this.passwordForm.controls.newPassword.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.passwordForm.controls.confirmPassword.updateValueAndValidity();
    });
  }

  isDirty(): boolean {
    return this.form.dirty || this.passwordForm.dirty;
  }

  fieldInvalid(name: ProfileField): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  passwordInvalid(name: PasswordField): boolean {
    const control = this.passwordForm.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  toggleVisibility(field: PasswordVisibility): void {
    if (field === 'current') {
      this.showCurrent.update((value) => !value);
      return;
    }
    if (field === 'next') {
      this.showNew.update((value) => !value);
      return;
    }
    this.showConfirm.update((value) => !value);
  }

  async saveProfile(): Promise<void> {
    this.profileError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    const value = this.form.getRawValue();
    this.savingProfile.set(true);
    try {
      await this.auth.updateProfile({
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        phone: value.phone.trim(),
        email: value.email.trim(),
      });
      this.form.markAsPristine();
      this.toast.show(AUTH_COPY.profileSaved);
    } catch (error) {
      if (isAuthError(error) && error.code === 'duplicate-email') {
        this.form.controls.email.setErrors({ duplicate: true });
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      if (isAuthError(error) && error.code === 'duplicate-phone') {
        this.form.controls.phone.setErrors({ duplicate: true });
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      this.profileError.set(isAuthError(error) ? error.message : AUTH_COPY.cryptoUnavailable);
    } finally {
      this.savingProfile.set(false);
    }
  }

  async savePassword(): Promise<void> {
    this.passwordError.set(null);
    this.passwordForm.controls.confirmPassword.updateValueAndValidity();
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    const value = this.passwordForm.getRawValue();
    this.savingPassword.set(true);
    try {
      await this.auth.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
      this.passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      this.toast.show(AUTH_COPY.passwordChanged);
    } catch (error) {
      if (isAuthError(error) && error.code === 'invalid-credentials') {
        this.passwordForm.controls.currentPassword.setErrors({ current: true });
        this.passwordForm.controls.currentPassword.markAsTouched();
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      this.passwordError.set(isAuthError(error) ? error.message : AUTH_COPY.cryptoUnavailable);
    } finally {
      this.savingPassword.set(false);
    }
  }
}

function egyptianPhoneControl(control: AbstractControl): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '')) ? null : { phone: true };
}

function passwordControl(control: AbstractControl): { password: true } | null {
  return isValidPassword(String(control.value ?? '')) ? null : { password: true };
}

import { Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { isAuthError } from '@core/auth/auth.models';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import { EMAIL_PATTERN } from '@core/utils/email.util';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';
import { isValidPassword } from '@core/utils/password.util';
import { AuthShellComponent } from '../../ui/auth-shell/auth-shell.component';
import { matchControl } from '../../auth.validators';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly showPassword = signal(false);
  readonly submitting = this.auth.loading;
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, egyptianPhoneControl]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    password: ['', [Validators.required, passwordControl]],
    confirmPassword: ['', [Validators.required, matchControl('password')]],
    terms: [false, Validators.requiredTrue],
  });

  constructor() {
    this.form.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.form.controls.confirmPassword.updateValueAndValidity();
    });
  }

  fieldInvalid(
    name:
      | 'firstName'
      | 'lastName'
      | 'phone'
      | 'email'
      | 'password'
      | 'confirmPassword'
      | 'terms',
  ): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  async submit(): Promise<void> {
    this.formError.set(null);
    this.form.controls.confirmPassword.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    const value = this.form.getRawValue();
    try {
      await this.auth.register({
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email,
        password: value.password,
      });
      this.toast.show(AUTH_COPY.registerSuccess);
      await this.router.navigateByUrl('/account');
    } catch (error) {
      if (isAuthError(error) && error.code === 'duplicate-email') {
        this.form.controls.email.setErrors({ duplicate: true });
        this.form.controls.email.markAsTouched();
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      if (isAuthError(error) && error.code === 'duplicate-phone') {
        this.form.controls.phone.setErrors({ duplicate: true });
        this.form.controls.phone.markAsTouched();
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      this.formError.set(isAuthError(error) ? error.message : AUTH_COPY.cryptoUnavailable);
    }
  }
}

function egyptianPhoneControl(control: { value: string }): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '')) ? null : { phone: true };
}

function passwordControl(control: { value: string }): { password: true } | null {
  return isValidPassword(String(control.value ?? '')) ? null : { password: true };
}

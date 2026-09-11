import { Component, ElementRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_COPY, AUTH_LOGIN_PATH } from '@core/auth/auth.constants';
import { isAuthError } from '@core/auth/auth.models';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import { EMAIL_PATTERN } from '@core/utils/email.util';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';
import { isValidPassword } from '@core/utils/password.util';
import { IconComponent } from '@shared/components/icon/icon.component';
import { AuthShellComponent } from '../../ui/auth-shell/auth-shell.component';
import { matchControl } from '../../auth.validators';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, IconComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly loginPath = AUTH_LOGIN_PATH;
  readonly showPassword = signal(false);
  readonly submitting = this.auth.loading;
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
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
    name: 'firstName' | 'lastName' | 'phone' | 'email' | 'password' | 'confirmPassword' | 'terms',
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
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        phone: value.phone.trim(),
        email: value.email.trim(),
        password: value.password,
      });
      this.toast.show(AUTH_COPY.registerSuccess);
      await this.router.navigateByUrl('/account', { replaceUrl: true });
    } catch (error) {
      if (isAuthError(error) && (error.code === 'duplicate-email' || error.code === 'duplicate-phone')) {
        this.formError.set(AUTH_COPY.duplicateAccount);
        if (error.code === 'duplicate-email') {
          this.form.controls.email.setErrors({ duplicate: true });
          this.form.controls.email.markAsTouched();
        } else {
          this.form.controls.phone.setErrors({ duplicate: true });
          this.form.controls.phone.markAsTouched();
        }
        focusFirstInvalid(this.host.nativeElement);
        return;
      }
      this.formError.set(isAuthError(error) ? error.message : AUTH_COPY.cryptoUnavailable);
    }
  }
}

function egyptianPhoneControl(control: { value: string }): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '').trim()) ? null : { phone: true };
}

function passwordControl(control: { value: string }): { password: true } | null {
  return isValidPassword(String(control.value ?? '')) ? null : { password: true };
}

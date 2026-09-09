import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { isAuthError } from '@core/auth/auth.models';
import { AuthStore } from '@core/auth/auth.store';
import { CanDeactivateDirty } from '@core/auth/unsaved-changes.guard';
import { ToastService } from '@core/services/toast.service';
import { EMAIL_PATTERN } from '@core/utils/email.util';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';

@Component({
  selector: 'app-account-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './account-profile-page.component.html',
  styleUrl: './account-profile-page.component.scss',
})
export class AccountProfilePageComponent implements CanDeactivateDirty {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly saving = this.auth.loading;
  readonly formError = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, egyptianPhoneControl]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
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
  }

  isDirty(): boolean {
    return this.form.dirty;
  }

  fieldInvalid(name: 'firstName' | 'lastName' | 'phone' | 'email'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  async save(): Promise<void> {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    try {
      await this.auth.updateProfile(this.form.getRawValue());
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
      this.formError.set(isAuthError(error) ? error.message : AUTH_COPY.cryptoUnavailable);
    }
  }
}

function egyptianPhoneControl(control: { value: string }): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '')) ? null : { phone: true };
}

import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_COPY, DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/auth.constants';
import { isAuthError } from '@core/auth/auth.models';
import { AuthStore } from '@core/auth/auth.store';
import { resolvePostAuthUrl } from '@core/auth/safe-return-url.util';
import { ToastService } from '@core/services/toast.service';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';
import { environment } from '@environments/environment';
import { AuthShellComponent } from '../../ui/auth-shell/auth-shell.component';
import { identifierValidator } from '../../auth.validators';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly showDemo = environment.showDemoCredentials;
  readonly demoEmail = DEMO_EMAIL;
  readonly demoPassword = DEMO_PASSWORD;
  readonly showPassword = signal(false);
  readonly submitting = this.auth.loading;
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, identifierValidator]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  fieldInvalid(name: 'identifier' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  fillDemo(): void {
    this.form.patchValue({
      identifier: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    this.form.controls.identifier.markAsDirty();
    this.form.controls.password.markAsDirty();
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  async submit(): Promise<void> {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    const value = this.form.getRawValue();
    try {
      await this.auth.login(value);
      this.toast.show(AUTH_COPY.loginSuccess);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(resolvePostAuthUrl(returnUrl));
    } catch (error) {
      this.formError.set(isAuthError(error) ? error.message : AUTH_COPY.invalidCredentials);
    }
  }
}

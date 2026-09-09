import { Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AUTH_COPY } from '@core/auth/auth.constants';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import { ACCOUNT_NAV_LINKS } from '../../account-nav';

@Component({
  selector: 'app-account-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.scss',
})
export class AccountLayoutComponent {
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);

  readonly user = this.auth.user;
  readonly displayName = this.auth.displayName;
  readonly initial = this.auth.initial;
  readonly links = ACCOUNT_NAV_LINKS;

  constructor() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag('name="robots"'));
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.toast.show(AUTH_COPY.logoutSuccess);
    await this.router.navigateByUrl('/');
  }
}

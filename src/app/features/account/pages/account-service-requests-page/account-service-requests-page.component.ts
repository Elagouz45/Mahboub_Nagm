import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountServiceRequest, SERVICE_REQUEST_STATUS_LABELS } from '@core/auth/account.models';
import { AuthStore } from '@core/auth/auth.store';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-service-requests-page',
  imports: [DatePipe, RouterLink, EmptyStateComponent],
  templateUrl: './account-service-requests-page.component.html',
  styleUrl: './account-service-requests-page.component.scss',
})
export class AccountServiceRequestsPageComponent {
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);

  readonly requests = signal<readonly AccountServiceRequest[]>([]);
  readonly statusLabels = SERVICE_REQUEST_STATUS_LABELS;

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    this.requests.set(await this.account.listServiceRequests(user.id));
  }
}

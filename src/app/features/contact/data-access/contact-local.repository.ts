import { inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { AuthStore } from '@core/auth/auth.store';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { ContactRequest, ContactSubmitResult } from '../models/contact.model';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactLocalRepository extends ContactRepository {
  private readonly commerce = inject(DemoCommerceService);
  private readonly auth = inject(AuthStore);
  submit(request: ContactRequest): Observable<ContactSubmitResult> {
    return defer(async () => {
      await this.auth.restoreSession();
      const reference = this.commerce.submitMessage(request);
      return reference ? { reference } : 'failed';
    });
  }
}

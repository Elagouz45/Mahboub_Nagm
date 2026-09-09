import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContactRequest, ContactSubmitResult } from '../models/contact.model';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactUnavailableRepository extends ContactRepository {
  submit(request: ContactRequest): Observable<ContactSubmitResult> {
    void request;
    return of('unavailable');
  }
}

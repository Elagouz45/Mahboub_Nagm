import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest, ContactSubmitResult } from '../models/contact.model';

@Injectable()
export abstract class ContactRepository {
  abstract submit(request: ContactRequest): Observable<ContactSubmitResult>;
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OffersQuery, OffersSearchResult } from '../models/offers.model';

@Injectable()
export abstract class OffersRepository {
  abstract search(query: OffersQuery): Observable<OffersSearchResult>;
}

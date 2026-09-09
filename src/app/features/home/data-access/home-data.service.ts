import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, ProductSummary } from '@shared/models/storefront.model';
import {
  MOCK_BEST_SELLERS,
  MOCK_CATEGORIES,
  MOCK_OFFERS,
  createOfferEndDate,
} from './home.mock';

export interface HomeOffersPayload {
  readonly products: readonly ProductSummary[];
  readonly endsAt: Date;
}

@Injectable({ providedIn: 'root' })
export class HomeDataService {
  getCategories(): Observable<readonly Category[]> {
    return of(MOCK_CATEGORIES);
  }

  getOffers(): Observable<HomeOffersPayload> {
    return of({ products: MOCK_OFFERS, endsAt: createOfferEndDate() });
  }

  getBestSellers(): Observable<readonly ProductSummary[]> {
    return of(MOCK_BEST_SELLERS);
  }
}

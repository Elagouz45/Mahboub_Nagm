import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { HomeDataService } from '../data-access/home-data.service';
import { HomeStore } from './home.store';

describe('HomeStore', () => {
  it('exposes an error state and can retry', () => {
    const data = {
      getCategories: vi.fn().mockReturnValueOnce(throwError(() => new Error('fail'))).mockReturnValue(of([])),
      getOffers: vi.fn().mockReturnValue(of({ products: [], endsAt: new Date() })),
      getBestSellers: vi.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [HomeStore, { provide: HomeDataService, useValue: data }],
    });

    const store = TestBed.inject(HomeStore);
    expect(store.categories().status).toBe('error');
    expect(store.categories().error).toBe(USER_ERROR_MESSAGES.server);

    store.retryCategories();
    expect(store.categories().status).toBe('empty');
  });
});

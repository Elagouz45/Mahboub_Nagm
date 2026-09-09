import { TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { ServiceCentersRepository } from '../data-access/service-centers.repository';
import { DEFAULT_SERVICE_CENTERS_QUERY, ServiceCentersSearchResult } from '../models/service-center.model';
import { ServiceCentersStore } from './service-centers.store';

describe('ServiceCentersStore', () => {
  it('cancels an in-flight search with switchMap', async () => {
    const first$ = new Subject<ServiceCentersSearchResult>();
    const search = vi
      .fn()
      .mockReturnValueOnce(first$.asObservable())
      .mockReturnValueOnce(of({ items: [], total: 0 }));

    TestBed.configureTestingModule({
      providers: [ServiceCentersStore, { provide: ServiceCentersRepository, useValue: { search } }],
    });
    const store = TestBed.inject(ServiceCentersStore);

    store.load(DEFAULT_SERVICE_CENTERS_QUERY);
    store.load({ ...DEFAULT_SERVICE_CENTERS_QUERY, governorate: 'cairo' });
    first$.next({
      items: [
        {
          id: 'invented',
          name: 'فرع مخترع',
          governorate: 'cairo',
          categorySlugs: [],
        },
      ],
      total: 1,
    });
    await Promise.resolve();

    expect(store.query().governorate).toBe('cairo');
    expect(store.result().items).toEqual([]);
    expect(store.loading()).toBe(false);
  });
});

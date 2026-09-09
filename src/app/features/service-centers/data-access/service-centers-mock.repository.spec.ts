import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_SERVICE_CENTERS_QUERY } from '../models/service-center.model';
import { SERVICE_CENTERS } from './service-centers.mock';
import { ServiceCentersMockRepository } from './service-centers-mock.repository';
import { ServiceCentersRepository } from './service-centers.repository';

describe('ServiceCentersMockRepository', () => {
  it('returns an empty approved list without invented branches', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ServiceCentersRepository, useClass: ServiceCentersMockRepository }],
    });
    const repo = TestBed.inject(ServiceCentersRepository);
    const result = await firstValueFrom(repo.search(DEFAULT_SERVICE_CENTERS_QUERY));
    expect(SERVICE_CENTERS).toEqual([]);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });
});

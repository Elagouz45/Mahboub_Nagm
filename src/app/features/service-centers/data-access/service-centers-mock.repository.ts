import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceCentersQuery, ServiceCentersSearchResult } from '../models/service-center.model';
import { SERVICE_CENTERS } from './service-centers.mock';
import { ServiceCentersRepository } from './service-centers.repository';

@Injectable()
export class ServiceCentersMockRepository extends ServiceCentersRepository {
  search(query: ServiceCentersQuery): Observable<ServiceCentersSearchResult> {
    const needle = query.q.trim().toLowerCase();
    const items = SERVICE_CENTERS.filter((center) => {
      const haystack = `${center.name} ${center.governorate}`.toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      const matchesGovernorate = !query.governorate || center.governorate === query.governorate;
      const matchesCategory =
        !query.category || center.categorySlugs.includes(query.category);
      return matchesQuery && matchesGovernorate && matchesCategory;
    });

    return of({ items, total: items.length });
  }
}

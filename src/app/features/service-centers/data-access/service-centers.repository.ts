import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceCentersQuery, ServiceCentersSearchResult } from '../models/service-center.model';

@Injectable()
export abstract class ServiceCentersRepository {
  abstract search(query: ServiceCentersQuery): Observable<ServiceCentersSearchResult>;
}

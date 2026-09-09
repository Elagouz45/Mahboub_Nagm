import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandsQuery, BrandsSearchResult } from '../models/brands.model';

@Injectable()
export abstract class BrandsRepository {
  abstract search(query: BrandsQuery): Observable<BrandsSearchResult>;
}

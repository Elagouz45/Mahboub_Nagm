import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogQuery, CatalogSearchResult } from '../models/catalog.model';

@Injectable()
export abstract class CatalogRepository {
  abstract search(query: CatalogQuery): Observable<CatalogSearchResult>;
}

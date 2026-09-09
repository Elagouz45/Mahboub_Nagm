import { ParamMap, Params } from '@angular/router';
import { VALID_CATEGORY_SLUGS } from '@features/catalog/models/catalog.model';
import {
  DEFAULT_SERVICE_CENTERS_QUERY,
  ServiceCentersQuery,
} from '../models/service-center.model';
import { EGYPT_GOVERNORATE_SLUGS } from './egypt-governorates';

export function parseServiceCentersQuery(params: ParamMap): ServiceCentersQuery {
  const category = params.get('category') ?? '';
  const governorate = params.get('governorate') ?? '';
  return {
    q: (params.get('q') ?? '').trim(),
    governorate: EGYPT_GOVERNORATE_SLUGS.includes(governorate) ? governorate : '',
    category: VALID_CATEGORY_SLUGS.includes(category) ? category : '',
  };
}

export function serviceCentersQueryToParams(query: Partial<ServiceCentersQuery>): Params {
  const params: Params = {};
  const q = query.q?.trim();
  if (q) {
    params['q'] = q;
  }
  if (query.governorate) {
    params['governorate'] = query.governorate;
  }
  if (query.category) {
    params['category'] = query.category;
  }
  return params;
}

export function mergeServiceCentersQuery(
  current: ServiceCentersQuery,
  patch: Partial<ServiceCentersQuery>,
): ServiceCentersQuery {
  return {
    ...DEFAULT_SERVICE_CENTERS_QUERY,
    ...current,
    ...patch,
  };
}

import { convertToParamMap } from '@angular/router';
import { DEFAULT_OFFERS_QUERY } from '../models/offers.model';
import { offersQueryToParams, parseOffersQuery } from './offers-query.util';

describe('offers-query.util', () => {
  it('parses type, brands, and minDiscount', () => {
    const query = parseOffersQuery(
      convertToParamMap({
        type: 'today',
        category: 'washers',
        brands: 'lg,samsung,nope',
        minDiscount: '20',
        sort: 'price-asc',
        page: '2',
        pageSize: '24',
      }),
    );

    expect(query.type).toBe('today');
    expect(query.category).toBe('washers');
    expect(query.brands).toEqual(['lg', 'samsung']);
    expect(query.minDiscount).toBe(20);
    expect(query.sort).toBe('price-asc');
    expect(query.page).toBe(2);
    expect(query.pageSize).toBe(24);
  });

  it('falls back to defaults and omits them when serializing', () => {
    expect(parseOffersQuery(convertToParamMap({ type: 'bundles' }))).toEqual(DEFAULT_OFFERS_QUERY);
    expect(offersQueryToParams(DEFAULT_OFFERS_QUERY)).toEqual({});
    expect(offersQueryToParams({ ...DEFAULT_OFFERS_QUERY, type: 'today' })['type']).toBe('today');
  });
});

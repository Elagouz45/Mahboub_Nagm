import { convertToParamMap } from '@angular/router';
import { DEFAULT_BRANDS_QUERY } from '../models/brands.model';
import { brandsQueryToParams, parseBrandsQuery } from './brands-query.util';

describe('brands-query.util', () => {
  it('parses known filters and ignores unknown category', () => {
    const query = parseBrandsQuery(
      convertToParamMap({
        q: 'lg',
        category: 'fridges',
        initial: 'l',
        page: '2',
        pageSize: '24',
        sort: 'relevance',
      }),
    );

    expect(query).toEqual({
      q: 'lg',
      category: 'fridges',
      initial: 'L',
      page: 2,
      pageSize: 24,
      sort: 'relevance',
    });
  });

  it('omits default params when serializing', () => {
    expect(brandsQueryToParams(DEFAULT_BRANDS_QUERY)).toEqual({});
    expect(brandsQueryToParams({ ...DEFAULT_BRANDS_QUERY, q: 'samsung', page: 2 })['q']).toBe(
      'samsung',
    );
  });
});

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

  it('parses supported sort values', () => {
    expect(parseBrandsQuery(convertToParamMap({ sort: 'name-desc' })).sort).toBe('name-desc');
    expect(parseBrandsQuery(convertToParamMap({ sort: 'products-desc' })).sort).toBe('products-desc');
    expect(parseBrandsQuery(convertToParamMap({ sort: 'popular' })).sort).toBe('name');
  });

  it('omits default params when serializing', () => {
    expect(brandsQueryToParams(DEFAULT_BRANDS_QUERY)).toEqual({});
    expect(brandsQueryToParams({ ...DEFAULT_BRANDS_QUERY, q: 'samsung', page: 2 })['q']).toBe(
      'samsung',
    );
  });

  it('accepts the brands home category and ignores unknown values', () => {
    expect(parseBrandsQuery(convertToParamMap({ category: 'home' })).category).toBe('home');
    expect(parseBrandsQuery(convertToParamMap({ category: 'unknown' })).category).toBe('');
  });
});

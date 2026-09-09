import { convertToParamMap } from '@angular/router';
import { DEFAULT_CATALOG_QUERY } from '../models/catalog.model';
import {
  catalogQueryToParams,
  parseCatalogQuery,
  removeChipFromQuery,
  buildActiveChips,
  legacyShopLandingRedirect,
} from './catalog-query.util';

describe('catalog-query.util', () => {
  it('parses homepage aliases and ignores unknown values', () => {
    const query = parseCatalogQuery(
      convertToParamMap({
        brand: 'lg',
        offers: '1',
        sort: 'bestselling',
        bundle: 'home',
        category: 'not-a-department',
        brands: '1',
        minPrice: 'abc',
        maxPrice: 'not-a-number',
        availability: 'maybe',
        view: 'masonry',
      }),
    );

    expect(query.brands).toEqual(['lg']);
    expect(query.offer).toBe('todays');
    expect(query.sort).toBe('bestselling');
    expect(query.category).toBe('');
    expect(query.minPrice).toBeNull();
    expect(query.maxPrice).toBeNull();
    expect(query.availability).toBeNull();
    expect(query.view).toBe('grid');
    expect(query.page).toBe(1);
    expect(query.pageSize).toBe(12);
  });

  it('maps the refrigerators alias to fridges', () => {
    const query = parseCatalogQuery(convertToParamMap({ category: 'refrigerators' }));
    expect(query.category).toBe('fridges');
  });

  it('prefers brands over singular brand and uses stored view', () => {
    const query = parseCatalogQuery(
      convertToParamMap({
        brands: 'samsung,fresh,unknown',
        brand: 'lg',
        page: '3',
        pageSize: '24',
      }),
      'list',
    );

    expect(query.brands).toEqual(['samsung', 'fresh']);
    expect(query.page).toBe(3);
    expect(query.pageSize).toBe(24);
    expect(query.view).toBe('list');
  });

  it('omits defaults when serializing and keeps bundle', () => {
    const params = catalogQueryToParams(
      {
        ...DEFAULT_CATALOG_QUERY,
        q: 'ثلاجة',
        category: 'fridges',
        sort: 'price-asc',
      },
      convertToParamMap({ bundle: 'home' }),
    );

    expect(params['q']).toBe('ثلاجة');
    expect(params['category']).toBe('fridges');
    expect(params['sort']).toBe('price-asc');
    expect(params['bundle']).toBe('home');
    expect(params['page']).toBeUndefined();
    expect(params['view']).toBeUndefined();
    expect(params['offer']).toBeUndefined();
  });

  it('builds and removes active chips without touching search', () => {
    const query = {
      ...DEFAULT_CATALOG_QUERY,
      q: 'فريش',
      category: 'washers',
      brands: ['lg'],
    };
    const chips = buildActiveChips(query);
    expect(chips.map((chip) => chip.id)).toEqual(['category:washers', 'brand:lg']);

    const next = removeChipFromQuery(query, 'category:washers');
    expect(next.category).toBe('');
    expect(next.q).toBe('فريش');
    expect(next.page).toBe(1);
  });

  it('redirects legacy shop landing aliases to dedicated pages', () => {
    expect(legacyShopLandingRedirect(convertToParamMap({ offers: '1', q: 'lg' }))).toEqual({
      path: '/offers',
      queryParams: { type: 'today', q: 'lg' },
    });
    expect(legacyShopLandingRedirect(convertToParamMap({ brands: '1' }))).toEqual({
      path: '/brands',
      queryParams: {},
    });
    expect(legacyShopLandingRedirect(convertToParamMap({ brand: 'lg' }))).toBeNull();
  });
});

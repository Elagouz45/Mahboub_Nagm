import { DEFAULT_CATALOG_QUERY } from '../models/catalog.model';
import { MOCK_CATALOG_PRODUCTS, searchCatalog } from './catalog-mock.service';

describe('catalog mock repository', () => {
  it('covers all categories and at least eight brands', () => {
    const categories = new Set(MOCK_CATALOG_PRODUCTS.map((item) => item.categorySlug));
    const brands = new Set(MOCK_CATALOG_PRODUCTS.map((item) => item.brand.toLowerCase()));
    expect(MOCK_CATALOG_PRODUCTS.length).toBeGreaterThanOrEqual(32);
    expect(categories.size).toBe(10);
    expect(brands.size).toBeGreaterThanOrEqual(8);
    expect(MOCK_CATALOG_PRODUCTS.some((item) => item.stockStatus === 'out-of-stock')).toBe(true);
  });

  it('filters, sorts, and paginates server-side', () => {
    const filtered = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      category: 'fridges',
      sort: 'price-asc',
      page: 1,
      pageSize: 12,
    });
    expect(filtered.items.every((item) => item.categorySlug === 'fridges')).toBe(true);
    const prices = filtered.items.map((item) => item.price);
    expect(prices).toEqual([...prices].sort((left, right) => left - right));

    const page = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      page: 2,
      pageSize: 12,
    });
    expect(page.items).toHaveLength(12);
    expect(page.total).toBe(MOCK_CATALOG_PRODUCTS.length);
    expect(page.items[0]?.id).not.toBe(
      searchCatalog(MOCK_CATALOG_PRODUCTS, DEFAULT_CATALOG_QUERY).items[0]?.id,
    );
  });

  it('ignores invalid prices and keeps search matches', () => {
    const result = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      q: 'ثلاجة',
      minPrice: Number.NaN,
      maxPrice: Number.POSITIVE_INFINITY,
    });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((item) => item.title.includes('ثلاجة'))).toBe(true);
  });

  it('exposes kitchen, oven, and water-heater attribute filters', () => {
    const kitchen = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      category: 'kitchen',
      attributes: [{ key: 'burners', value: '5' }],
    });
    expect(kitchen.filters.attributes.some((group) => group.key === 'burners')).toBe(true);
    expect(kitchen.items.every((item) => item.categorySlug === 'kitchen')).toBe(true);
    expect(kitchen.total).toBeGreaterThan(0);

    const ovens = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      category: 'ovens',
    });
    expect(ovens.filters.attributes.map((group) => group.key)).toEqual([
      'capacity',
      'fuel',
      'installType',
    ]);

    const heaters = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      category: 'water-heaters',
    });
    expect(heaters.filters.attributes.map((group) => group.key)).toEqual([
      'capacity',
      'fuel',
      'installType',
      'digital',
    ]);
  });

  it('filters discounted products by a minimum percent', () => {
    const result = searchCatalog(MOCK_CATALOG_PRODUCTS, {
      ...DEFAULT_CATALOG_QUERY,
      offer: 'discounted',
      minDiscount: 20,
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((item) => (item.discountPercent ?? 0) >= 20)).toBe(true);
  });
});

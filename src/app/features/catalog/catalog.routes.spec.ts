import { CATALOG_ROUTES } from './catalog.routes';

describe('CATALOG_ROUTES', () => {
  it('lazy-loads the shop page at /products', () => {
    expect(CATALOG_ROUTES).toHaveLength(1);
    expect(CATALOG_ROUTES[0]?.path).toBe('');
    expect(CATALOG_ROUTES[0]?.title).toBe('المتجر');
    expect(typeof CATALOG_ROUTES[0]?.loadComponent).toBe('function');
    expect(CATALOG_ROUTES[0]?.component).toBeUndefined();
  });
});

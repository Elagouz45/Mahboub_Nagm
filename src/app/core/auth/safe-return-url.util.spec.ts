import { sanitizeReturnUrl } from './safe-return-url.util';

describe('sanitizeReturnUrl', () => {
  it('accepts internal paths', () => {
    expect(sanitizeReturnUrl('/account')).toBe('/account');
    expect(sanitizeReturnUrl('/products?q=lg')).toBe('/products?q=lg');
  });

  it('rejects external and auth routes', () => {
    expect(sanitizeReturnUrl('https://evil.test')).toBeNull();
    expect(sanitizeReturnUrl('//evil.test')).toBeNull();
    expect(sanitizeReturnUrl('/auth/login')).toBeNull();
    expect(sanitizeReturnUrl('http://example.com')).toBeNull();
    expect(sanitizeReturnUrl('account')).toBeNull();
  });
});

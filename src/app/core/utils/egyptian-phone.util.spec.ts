import { isEgyptianMobile, normalizeEgyptianMobile } from './egyptian-phone.util';

describe('egyptian-phone.util', () => {
  it('accepts local and international Egyptian mobiles', () => {
    expect(isEgyptianMobile('01012345678')).toBe(true);
    expect(isEgyptianMobile('01112345678')).toBe(true);
    expect(isEgyptianMobile('+201012345678')).toBe(true);
    expect(isEgyptianMobile('010 1234 5678')).toBe(true);
  });

  it('normalizes international numbers to local format', () => {
    expect(normalizeEgyptianMobile('+201012345678')).toBe('01012345678');
    expect(normalizeEgyptianMobile('010 1234 5678')).toBe('01012345678');
  });

  it('rejects invalid numbers', () => {
    expect(isEgyptianMobile('0123456789')).toBe(false);
    expect(isEgyptianMobile('16642')).toBe(false);
    expect(isEgyptianMobile('+201123')).toBe(false);
  });
});

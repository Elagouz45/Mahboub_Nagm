import { convertToParamMap } from '@angular/router';
import { contactFaqTopic, legacyContactRedirect, parseContactType } from './contact-query.util';

describe('contact-query.util', () => {
  it('maps legacy topics to dedicated pages', () => {
    expect(legacyContactRedirect(convertToParamMap({ topic: 'about' }))).toEqual({
      path: '/about',
      queryParams: {},
    });
    expect(legacyContactRedirect(convertToParamMap({ topic: 'after-sales' }))).toEqual({
      path: '/after-sales',
      queryParams: {},
    });
    expect(legacyContactRedirect(convertToParamMap({ topic: 'maintenance', q: '1' }))).toEqual({
      path: '/service-centers',
      queryParams: {},
    });
    expect(legacyContactRedirect(convertToParamMap({ topic: 'returns' }))).toEqual({
      path: '/return-policy',
      queryParams: {},
    });
    expect(legacyContactRedirect(convertToParamMap({ topic: 'returns', type: 'complaint' }))).toBeNull();
    expect(legacyContactRedirect(convertToParamMap({ topic: 'privacy' }))).toBeNull();
    expect(legacyContactRedirect(convertToParamMap({ topic: 'faq' }))).toBeNull();
    expect(legacyContactRedirect(convertToParamMap({ type: 'maintenance' }))).toBeNull();
  });

  it('parses contact types and faq topics', () => {
    expect(parseContactType('complaint')).toBe('complaint');
    expect(parseContactType('unknown')).toBe('product');
    expect(contactFaqTopic('shipping')).toBe('shipping');
    expect(contactFaqTopic('warranty')).toBe('warranty');
    expect(contactFaqTopic('privacy')).toBeNull();
    expect(contactFaqTopic('about')).toBeNull();
    expect(contactFaqTopic('after-sales')).toBeNull();
  });
});

import { convertToParamMap } from '@angular/router';
import { EGYPT_GOVERNORATES } from './egypt-governorates';
import { parseServiceCentersQuery, serviceCentersQueryToParams } from './service-centers-query.util';

describe('service-centers-query.util', () => {
  it('accepts known governorates and catalog device types only', () => {
    expect(EGYPT_GOVERNORATES.some((item) => item.label === 'القاهرة')).toBe(true);
    expect(
      parseServiceCentersQuery(
        convertToParamMap({ q: ' مركز ', governorate: 'cairo', category: 'washers' }),
      ),
    ).toEqual({ q: 'مركز', governorate: 'cairo', category: 'washers' });
    expect(
      parseServiceCentersQuery(convertToParamMap({ governorate: 'paris', category: 'unknown' })),
    ).toEqual({ q: '', governorate: '', category: '' });
  });

  it('omits empty query params', () => {
    expect(serviceCentersQueryToParams({ q: '', governorate: 'cairo', category: '' })).toEqual({
      governorate: 'cairo',
    });
  });
});

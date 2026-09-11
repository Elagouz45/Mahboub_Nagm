import { brandDirectoryLabel, isBrandsCategoryFilter, matchesHomeCategory } from './brands-directory.util';

describe('brands-directory.util', () => {
  it('maps directory labels from the brand pack without replacing live product counts', () => {
    expect(brandDirectoryLabel('samsung', 'غسالات')).toBe('غسالات وأجهزة منزلية');
    expect(brandDirectoryLabel('unknown', 'أخرى')).toBe('أخرى');
    expect(matchesHomeCategory('ثلاجات وأجهزة منزلية')).toBe(true);
    expect(matchesHomeCategory('تكييفات')).toBe(false);
    expect(isBrandsCategoryFilter('home')).toBe(true);
    expect(isBrandsCategoryFilter('fridges')).toBe(true);
    expect(isBrandsCategoryFilter('unknown')).toBe(false);
  });
});

import { formatBrandsCount } from './brands-copy.util';

describe('formatBrandsCount', () => {
  it('handles Arabic plural forms for catalog counts', () => {
    expect(formatBrandsCount(0)).toBe('لا توجد علامات تجارية');
    expect(formatBrandsCount(1)).toBe('علامة تجارية واحدة');
    expect(formatBrandsCount(2)).toBe('علامتان تجاريتان');
    expect(formatBrandsCount(9)).toBe('9 علامات تجارية');
    expect(formatBrandsCount(11)).toBe('11 علامة تجارية');
  });

  it('formats trusted intro counts', () => {
    expect(formatBrandsCount(9, 'trusted')).toBe('9 علامات موثوقة');
  });

  it('formats a short badge count', () => {
    expect(formatBrandsCount(9, 'badge')).toBe('9 علامات');
  });
});

import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_BRANDS_QUERY } from '../models/brands.model';
import { BrandsMockRepository } from './brands-mock.repository';
import { BrandsRepository } from './brands.repository';

describe('BrandsMockRepository', () => {
  it('includes catalog brands, including TCL without a logo file', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: BrandsRepository, useClass: BrandsMockRepository }],
    });
    const repo = TestBed.inject(BrandsRepository);
    const result = await firstValueFrom(repo.search(DEFAULT_BRANDS_QUERY));
    expect(result.featured).toBeNull();
    expect(result.items.some((brand) => brand.slug === 'tcl' && brand.imageSrc === '')).toBe(true);
    expect(result.items.some((brand) => brand.slug === 'lg' && brand.imageSrc.includes('lg.svg'))).toBe(
      true,
    );
  });
});

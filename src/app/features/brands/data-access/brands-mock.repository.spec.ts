import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_BRANDS_QUERY } from '../models/brands.model';
import { BrandsMockRepository } from './brands-mock.repository';
import { BrandsRepository } from './brands.repository';

describe('BrandsMockRepository', () => {
  it('includes catalog brands with local PNG logos', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: BrandsRepository, useClass: BrandsMockRepository }],
    });
    const repo = TestBed.inject(BrandsRepository);
    const result = await firstValueFrom(repo.search(DEFAULT_BRANDS_QUERY));
    expect(result.featured).toBeNull();
    expect(result.catalogTotal).toBeGreaterThan(0);
    expect(result.wall.map((brand) => brand.slug)).toEqual([
      'samsung',
      'lg',
      'toshiba',
      'sharp',
      'carrier',
      'fresh',
    ]);
    expect(
      result.items.some((brand) => brand.slug === 'tcl' && brand.imageSrc.includes('tcl.png')),
    ).toBe(true);
    expect(result.items.some((brand) => brand.slug === 'lg' && brand.imageSrc.includes('lg.png'))).toBe(
      true,
    );
  });

  it('filters by search, letter, and home category together', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: BrandsRepository, useClass: BrandsMockRepository }],
    });
    const repo = TestBed.inject(BrandsRepository);
    const home = await firstValueFrom(
      repo.search({ ...DEFAULT_BRANDS_QUERY, category: 'home' }),
    );
    expect(home.items.length).toBeGreaterThan(0);
    expect(home.items.every((brand) => brand.categoryLabel.includes('منزلية'))).toBe(true);

    const letter = await firstValueFrom(repo.search({ ...DEFAULT_BRANDS_QUERY, initial: 'L' }));
    expect(letter.items.every((brand) => brand.initial === 'L')).toBe(true);

    const search = await firstValueFrom(repo.search({ ...DEFAULT_BRANDS_QUERY, q: 'lg' }));
    expect(search.items.some((brand) => brand.slug === 'lg')).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { CART_PORT, WISHLIST_PORT } from '@core/tokens/commerce.tokens';
import { CartStore } from '@features/cart/state/cart.store';
import { WishlistStore } from '@features/wishlist/state/wishlist.store';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  it('renders the hero heading', async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
        { provide: CART_PORT, useExisting: CartStore },
        { provide: WISHLIST_PORT, useExisting: WishlistStore },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'كل أجهزة بيتك في مكان واحد',
    );
    const heroImage = fixture.nativeElement.querySelector('.hero img') as HTMLImageElement | null;
    expect(heroImage).not.toBeNull();
    expect(heroImage?.getAttribute('ng-src') ?? heroImage?.getAttribute('src')).toContain(
      'hero-appliance-collection.webp',
    );
    expect(heroImage?.getAttribute('loading')).not.toBe('lazy');
  });
});

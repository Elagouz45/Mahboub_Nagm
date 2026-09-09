import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OffersSectionComponent } from './offers-section.component';

describe('OffersSectionComponent', () => {
  async function setup(endsAt: Date, status: 'loading' | 'success' = 'success') {
    await TestBed.configureTestingModule({
      imports: [OffersSectionComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(OffersSectionComponent);
    const ref = fixture.componentRef as ComponentRef<OffersSectionComponent>;
    ref.setInput('state', {
      status,
      data: { products: [], endsAt },
      error: null,
    });
    fixture.detectChanges();
    return fixture;
  }

  it('clears the countdown interval on destroy', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    const fixture = await setup(new Date(Date.now() + 60_000), 'loading');
    fixture.destroy();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('hides the timer while offers are loading', async () => {
    const fixture = await setup(new Date(0), 'loading');
    expect(fixture.nativeElement.querySelector('.offers__timer')).toBeNull();
  });

  it('renders labeled hour, minute, and second units', async () => {
    const fixture = await setup(new Date(Date.now() + 12 * 3_600_000 + 18 * 60_000 + 43_000));
    const timer = fixture.nativeElement.querySelector('.offers__timer') as HTMLElement;
    const values = [...timer.querySelectorAll('.offers__timer-value')].map(
      (node) => node.textContent?.trim(),
    );

    expect(timer.textContent).toContain('ينتهي العرض خلال');
    expect(timer.textContent).toContain('ساعة');
    expect(timer.textContent).toContain('دقيقة');
    expect(timer.textContent).toContain('ثانية');
    expect(values[0]).toBe('12');
    expect(values[1]).toBe('18');
    expect(timer.getAttribute('aria-label')).toContain('ساعة');
  });

  it('announces when the offer has ended', async () => {
    const fixture = await setup(new Date(Date.now() - 1_000));
    const timer = fixture.nativeElement.querySelector('.offers__timer') as HTMLElement;
    expect(timer.textContent).toContain('انتهى العرض');
    expect(timer.querySelector('.offers__timer-units')).toBeNull();
  });
});

import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAuth } from '@core/auth/provide-auth';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  it('renders a main landmark with a router outlet', async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideZonelessChangeDetection(),
        ...provideAuth(),
        provideRouter([]),
        { provide: WHATSAPP_NUMBER, useValue: '' },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MainLayoutComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main#main-content')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    const skip = compiled.querySelector<HTMLAnchorElement>('.skip-link');
    expect(skip?.getAttribute('href')).toBe('#main-content');
    expect(skip?.textContent).toContain('تخطي إلى المحتوى');
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('app-announcement-bar')).toBeNull();

    const footers = compiled.querySelectorAll('footer');
    expect(footers.length).toBe(1);
    expect(footers[0]?.querySelector('nav[aria-label="روابط سريعة"]')?.textContent).toContain(
      'روابط سريعة',
    );
    expect(footers[0]?.querySelector('nav[aria-label="أقسام المنتجات"]')).toBeNull();
  });
});

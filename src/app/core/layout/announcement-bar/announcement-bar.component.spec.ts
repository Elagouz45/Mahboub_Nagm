import { TestBed } from '@angular/core/testing';
import { AnnouncementBarComponent } from './announcement-bar.component';

describe('AnnouncementBarComponent', () => {
  it('renders the three trust messages with icons', async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementBarComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AnnouncementBarComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const text = compiled.textContent ?? '';
    expect(text).toContain('منتجات أصلية 100%');
    expect(text).toContain('ضمان معتمد على جميع المنتجات');
    expect(text).toContain('توصيل سريع لجميع المحافظات');
    expect(compiled.querySelectorAll('.announcement-bar__icon').length).toBeGreaterThanOrEqual(3);
    expect(compiled.querySelector('.skip-link')).toBeNull();
  });
});

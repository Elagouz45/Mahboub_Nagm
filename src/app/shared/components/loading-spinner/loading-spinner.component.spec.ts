import { TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  it('renders the default accessible loading label', async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]');
    expect(status?.textContent).toContain('جاري التحميل');
  });

  it('renders a custom label', async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.componentRef.setInput('label', 'جاري جلب المنتجات');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('جاري جلب المنتجات');
  });
});

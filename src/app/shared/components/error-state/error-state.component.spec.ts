import { TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  it('renders a safe user-facing error message', async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('title', 'تعذر تحميل المنتجات');
    fixture.componentRef.setInput('message', 'حدث خطأ في الخادم. حاول لاحقاً.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')).not.toBeNull();
    expect(compiled.querySelector('h2')?.textContent).toContain('تعذر تحميل المنتجات');
    expect(compiled.textContent).toContain('حدث خطأ في الخادم. حاول لاحقاً.');
  });

  it('emits retry when the retry button is clicked', async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ErrorStateComponent);
    fixture.componentRef.setInput('message', 'تعذر الاتصال بالخادم.');
    fixture.detectChanges();

    let retried = false;
    fixture.componentInstance.retry.subscribe(() => {
      retried = true;
    });

    fixture.nativeElement.querySelector('button')?.click();
    expect(retried).toBe(true);
  });
});

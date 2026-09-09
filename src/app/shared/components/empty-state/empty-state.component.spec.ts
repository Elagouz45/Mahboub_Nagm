import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  it('renders title, description, and optional icon', async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'لا توجد نتائج');
    fixture.componentRef.setInput('description', 'جرّب كلمات بحث أخرى.');
    fixture.componentRef.setInput('icon', '📭');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('لا توجد نتائج');
    expect(compiled.textContent).toContain('جرّب كلمات بحث أخرى.');
    expect(compiled.querySelector('.empty-state__icon')?.textContent).toContain('📭');
  });

  it('emits action when the optional button is clicked', async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'السلة فارغة');
    fixture.componentRef.setInput('actionLabel', 'تسوق الآن');
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.action.subscribe(() => {
      emitted = true;
    });

    fixture.nativeElement.querySelector('button')?.click();
    expect(emitted).toBe(true);
  });
});

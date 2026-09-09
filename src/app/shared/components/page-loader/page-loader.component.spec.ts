import { TestBed } from '@angular/core/testing';
import { PageLoaderComponent } from './page-loader.component';

describe('PageLoaderComponent', () => {
  it('renders a page-level loading status', async () => {
    await TestBed.configureTestingModule({
      imports: [PageLoaderComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(PageLoaderComponent);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]');
    expect(status).not.toBeNull();
    expect(status?.textContent).toContain('جاري تحميل الصفحة');
  });
});

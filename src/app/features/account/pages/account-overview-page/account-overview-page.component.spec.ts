import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { AccountOverviewPageComponent } from './account-overview-page.component';

describe('AccountOverviewPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('shows an empty shopping CTA for a newly registered user', async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOverviewPageComponent],
      providers: [...authTestProviders(), provideRouter([{ path: 'products', component: AccountOverviewPageComponent }])],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.register({
      firstName: 'نادر',
      lastName: 'سالم',
      phone: '01055555555',
      email: 'nader@test.example',
      password: 'Secret123',
    });

    const fixture = TestBed.createComponent(AccountOverviewPageComponent);
    await fixture.componentInstance.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('حسابك جاهز للتسوق');
    expect(fixture.nativeElement.textContent).toContain('تسوق الآن');
  });
});

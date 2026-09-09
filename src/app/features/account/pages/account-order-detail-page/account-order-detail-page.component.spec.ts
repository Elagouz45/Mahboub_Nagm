import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccountRepository } from '@core/auth/account.repository';
import { AuthStore } from '@core/auth/auth.store';
import { authTestProviders, clearAuthStorage } from '@core/auth/auth-testing';
import { AccountOrderDetailPageComponent } from './account-order-detail-page.component';

@Component({
  imports: [AccountOrderDetailPageComponent],
  template: '<app-account-order-detail-page [orderId]="orderId" />',
})
class HostComponent {
  orderId = 'demo-order-delivered';
}

describe('AccountOrderDetailPageComponent', () => {
  beforeEach(() => clearAuthStorage());
  afterEach(() => clearAuthStorage());

  it('shows an owned order and hides missing orders', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [...authTestProviders(), provideRouter([])],
    }).compileComponents();

    const auth = TestBed.inject(AuthStore);
    await auth.login({
      identifier: 'demo@mahboubtnagm.test',
      password: 'Demo@12345',
      rememberMe: true,
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.children[0].componentInstance as AccountOrderDetailPageComponent;
    await page.load();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('MN-24018');

    fixture.componentInstance.orderId = 'someone-else-order';
    fixture.detectChanges();
    await page.load('someone-else-order');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('الطلب غير موجود');
  });

  it('cannot load another user order from the repository', async () => {
    TestBed.configureTestingModule({ providers: authTestProviders() });
    const auth = TestBed.inject(AuthStore);
    const account = TestBed.inject(AccountRepository);
    await auth.register({
      firstName: 'ليلى',
      lastName: 'حسن',
      phone: '01512345678',
      email: 'laila@test.example',
      password: 'Secret123',
    });
    expect(await account.getOrder(auth.user()!.id, 'demo-order-delivered')).toBeNull();
  });
});

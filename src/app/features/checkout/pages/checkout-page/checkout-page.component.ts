import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountAddress } from '@core/auth/account.models';
import { DEMO_SHIPPING, DemoCommerceService } from '@core/services/demo-commerce.service';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { EGYPT_GOVERNORATES } from '@features/service-centers/data-access/egypt-governorates';
import { formatEgp } from '@shared/utils/format-price.util';
@Component({
  selector: 'app-checkout-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  readonly commerce = inject(DemoCommerceService);
  readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);
  readonly ready = signal(false);
  readonly step = signal(1);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly addresses = signal<readonly AccountAddress[]>([]);
  readonly governorates = EGYPT_GOVERNORATES;
  readonly price = formatEgp;
  readonly selectedGovernorate = signal('');
  readonly shipping = computed(() => DEMO_SHIPPING[this.selectedGovernorate()] ?? 0);
  readonly total = computed(() => this.commerce.subtotal() + this.shipping());
  private checkoutKey = '';
  readonly form = this.fb.nonNullable.group({
    recipientName: ['', [Validators.required, Validators.pattern(/\S.{2,}/)]],
    phone: ['', [Validators.required, Validators.pattern(/^(?:\+?20|0)?1[0125][0-9]{8}$/)]],
    governorateSlug: ['', Validators.required],
    city: ['', [Validators.required, Validators.pattern(/\S+/)]],
    street: ['', [Validators.required, Validators.pattern(/\S.{2,}/)]],
    details: [''],
    saveAddress: [false],
  });
  constructor() {
    afterNextRender(() => {
      void this.initialize();
    });
  }
  private async initialize(): Promise<void> {
    await this.auth.restoreSession();
    this.checkoutKey = globalThis.crypto.randomUUID();
    const user = this.auth.user();
    if (user) {
      this.form.patchValue({ recipientName: this.auth.displayName(), phone: user.phone });
      try {
        const addresses = await this.account.listAddresses(user.id);
        this.addresses.set(addresses);
        const preferred = addresses.find((a) => a.isDefault);
        if (preferred) this.useAddress(preferred.id);
      } catch {
        this.error.set('تعذر تحميل العناوين المحفوظة. يمكنك إدخال عنوانك هنا.');
      }
    }
    this.ready.set(true);
  }
  useAddress(id: string): void {
    const address = this.addresses().find((a) => a.id === id);
    if (address) {
      this.form.patchValue(address);
      this.selectedGovernorate.set(address.governorateSlug);
    } else {
      this.form.patchValue({ governorateSlug: '', city: '', street: '', details: '' });
      this.selectedGovernorate.set('');
    }
  }
  invalid(key: 'recipientName' | 'phone' | 'governorateSlug' | 'city' | 'street'): boolean {
    const control = this.form.controls[key];
    return control.invalid && control.touched;
  }
  next(): void {
    this.error.set('');
    if (this.form.invalid || !isEgyptianMobile(this.form.controls.phone.value)) {
      this.form.markAllAsTouched();
      this.error.set('راجع بيانات التوصيل، وأدخل رقم هاتف مصري صحيحًا.');
      this.document.querySelector<HTMLElement>('form .ng-invalid')?.focus();
      return;
    }
    this.selectedGovernorate.set(this.form.controls.governorateSlug.value);
    this.changeStep(Math.min(3, this.step() + 1));
  }
  changeStep(step: number): void {
    this.step.set(step);
    setTimeout(() => this.document.getElementById('checkout-step-heading')?.focus(), 0);
  }
  async confirm(): Promise<void> {
    if (this.submitting() || !this.ready()) return;
    if (this.form.invalid) {
      this.changeStep(1);
      this.next();
      return;
    }
    this.submitting.set(true);
    this.error.set('');
    try {
      const value = this.form.getRawValue();
      const address: AccountAddress = {
        id: 'checkout-' + this.checkoutKey,
        userId: this.commerce.owner(),
        label: 'home',
        recipientName: value.recipientName.trim(),
        phone: value.phone.trim(),
        governorateSlug: value.governorateSlug,
        city: value.city.trim(),
        street: value.street.trim(),
        details: value.details.trim(),
        isDefault: false,
      };
      if (value.saveAddress && this.auth.user())
        await this.account.saveAddress(this.auth.user()!.id, address);
      const order = this.commerce.placeOrder(address, this.checkoutKey);
      if (!order) {
        this.error.set(this.commerce.error());
        return;
      }
      await this.router.navigate(['/checkout/confirmation', order.id]);
    } catch {
      this.error.set('تعذر حفظ بيانات الطلب. لم يتم تأكيد العملية؛ حاول مجددًا.');
    } finally {
      this.submitting.set(false);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountRepository } from '@core/auth/account.repository';
import { AccountAddress, ADDRESS_LABELS, AddressLabel } from '@core/auth/account.models';
import { AuthStore } from '@core/auth/auth.store';
import { ToastService } from '@core/services/toast.service';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { EGYPT_GOVERNORATES } from '@features/service-centers/data-access/egypt-governorates';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-addresses-page',
  imports: [ReactiveFormsModule, EmptyStateComponent],
  templateUrl: './account-addresses-page.component.html',
  styleUrl: './account-addresses-page.component.scss',
})
export class AccountAddressesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly toast = inject(ToastService);

  readonly addresses = signal<readonly AccountAddress[]>([]);
  readonly editorOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly labels = ADDRESS_LABELS;
  readonly labelOptions: readonly AddressLabel[] = ['home', 'work', 'other'];
  readonly governorates = EGYPT_GOVERNORATES;

  readonly form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<AddressLabel>('home'),
    recipientName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, egyptianPhoneControl]],
    governorateSlug: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    details: [''],
    isDefault: [false],
  });

  constructor() {
    void this.reload();
  }

  governorateLabel(slug: string): string {
    return this.governorates.find((item) => item.slug === slug)?.label ?? slug;
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form.reset({
      label: 'home',
      recipientName: this.auth.displayName(),
      phone: this.auth.user()?.phone ?? '',
      governorateSlug: '',
      city: '',
      street: '',
      details: '',
      isDefault: this.addresses().length === 0,
    });
    this.editorOpen.set(true);
  }

  openEdit(address: AccountAddress): void {
    this.editingId.set(address.id);
    this.form.reset({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      governorateSlug: address.governorateSlug,
      city: address.city,
      street: address.street,
      details: address.details,
      isDefault: address.isDefault,
    });
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.auth.user();
    if (!user) {
      return;
    }
    await this.account.saveAddress(user.id, {
      ...this.form.getRawValue(),
      id: this.editingId() ?? undefined,
    });
    this.toast.show('تم حفظ العنوان');
    this.editorOpen.set(false);
    await this.reload();
  }

  async remove(address: AccountAddress): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    if (!globalThis.confirm('هل تريد حذف هذا العنوان؟')) {
      return;
    }
    await this.account.deleteAddress(user.id, address.id);
    this.toast.show('تم حذف العنوان');
    await this.reload();
  }

  fieldInvalid(
    name: 'recipientName' | 'phone' | 'governorateSlug' | 'city' | 'street',
  ): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  async reload(): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      return;
    }
    this.addresses.set(await this.account.listAddresses(user.id));
  }
}

function egyptianPhoneControl(control: { value: string }): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '')) ? null : { phone: true };
}

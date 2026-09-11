import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountAddress, ADDRESS_LABELS, AddressLabel } from '@core/auth/account.models';
import { AccountRepository } from '@core/auth/account.repository';
import { AuthStore } from '@core/auth/auth.store';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { ToastService } from '@core/services/toast.service';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { focusFirstInvalid } from '@core/utils/focus-invalid.util';
import { EGYPT_GOVERNORATES } from '@core/data/egypt-governorates';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { IconComponent } from '@shared/components/icon/icon.component';

type AddressField = 'recipientName' | 'phone' | 'governorateSlug' | 'city' | 'street';

@Component({
  selector: 'app-account-addresses-page',
  imports: [ReactiveFormsModule, EmptyStateComponent, ErrorStateComponent, IconComponent],
  templateUrl: './account-addresses-page.component.html',
  styleUrl: './account-addresses-page.component.scss',
})
export class AccountAddressesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthStore);
  private readonly account = inject(AccountRepository);
  private readonly toast = inject(ToastService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly labels = ADDRESS_LABELS;
  readonly labelOptions: readonly AddressLabel[] = ['home', 'work', 'other'];
  readonly governorates = EGYPT_GOVERNORATES;
  readonly loadErrorMessage = USER_ERROR_MESSAGES.unknown;
  readonly skeletonCards = [1, 2];

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly settingDefault = signal<string | null>(null);
  readonly addresses = signal<readonly AccountAddress[]>([]);
  readonly editorOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deleteTarget = signal<AccountAddress | null>(null);

  readonly initials = computed(() => {
    const current = this.auth.user();
    if (!current) {
      return 'م';
    }
    return `${current.firstName.charAt(0)}${current.lastName.charAt(0)}`.trim() || 'م';
  });

  readonly sortedAddresses = computed(() =>
    [...this.addresses()].sort((left, right) => Number(right.isDefault) - Number(left.isDefault)),
  );

  readonly form = this.fb.nonNullable.group({
    label: this.fb.nonNullable.control<AddressLabel>('home'),
    recipientName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, egyptianPhoneControl]],
    governorateSlug: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    building: [''],
    floor: [''],
    landmark: [''],
    isDefault: [false],
  });

  constructor() {
    void this.reload();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.saving() || this.deleting()) {
      return;
    }
    if (this.deleteTarget()) {
      this.cancelDelete();
      return;
    }
    if (this.editorOpen()) {
      this.closeEditor();
    }
  }

  governorateLabel(slug: string): string {
    return this.governorates.find((item) => item.slug === slug)?.label ?? slug;
  }

  addressLine(address: AccountAddress): string {
    return [this.governorateLabel(address.governorateSlug), address.city, address.street, address.details]
      .map((part) => part.trim())
      .filter(Boolean)
      .join('، ');
  }

  editorTitle(): string {
    return this.editingId() ? 'تعديل العنوان' : 'إضافة عنوان جديد';
  }

  fieldInvalid(name: AddressField): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
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
      building: '',
      floor: '',
      landmark: '',
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
      building: '',
      floor: address.details,
      landmark: '',
      isDefault: address.isDefault,
    });
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    if (this.saving()) {
      return;
    }
    this.editorOpen.set(false);
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    const user = this.auth.user();
    if (!user) {
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    try {
      await this.account.saveAddress(user.id, {
        label: value.label,
        recipientName: value.recipientName.trim(),
        phone: value.phone.trim(),
        governorateSlug: value.governorateSlug,
        city: value.city.trim(),
        street: value.street.trim(),
        details: composeDetails(value.building, value.floor, value.landmark),
        isDefault: value.isDefault,
        id: this.editingId() ?? undefined,
      });
      this.toast.show('تم حفظ العنوان');
      this.editorOpen.set(false);
      await this.reload(true);
    } catch {
      this.toast.show('تعذر حفظ العنوان. حاول مجددًا.');
    } finally {
      this.saving.set(false);
    }
  }

  async makeDefault(address: AccountAddress): Promise<void> {
    if (address.isDefault) {
      return;
    }
    const user = this.auth.user();
    if (!user) {
      return;
    }
    this.settingDefault.set(address.id);
    try {
      await this.account.saveAddress(user.id, { ...address, isDefault: true });
      this.toast.show('تم تعيين العنوان الافتراضي');
      await this.reload(true);
    } catch {
      this.toast.show('تعذر تعيين العنوان الافتراضي. حاول مجددًا.');
    } finally {
      this.settingDefault.set(null);
    }
  }

  requestDelete(address: AccountAddress): void {
    this.deleteTarget.set(address);
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.deleteTarget.set(null);
  }

  async confirmDelete(): Promise<void> {
    const address = this.deleteTarget();
    const user = this.auth.user();
    if (!address || !user) {
      return;
    }
    this.deleting.set(true);
    try {
      await this.account.deleteAddress(user.id, address.id);
      this.toast.show('تم حذف العنوان');
      this.deleteTarget.set(null);
      await this.reload(true);
    } catch {
      this.toast.show('تعذر حذف العنوان. حاول مجددًا.');
    } finally {
      this.deleting.set(false);
    }
  }

  async reload(quiet = false): Promise<void> {
    const user = this.auth.user();
    if (!user) {
      this.loading.set(false);
      return;
    }
    if (!quiet) {
      this.loading.set(true);
      this.loadError.set(false);
    }
    try {
      this.addresses.set(await this.account.listAddresses(user.id));
      this.loadError.set(false);
    } catch {
      if (quiet) {
        this.toast.show('تعذر تحديث قائمة العناوين. حاول مجددًا.');
      } else {
        this.loadError.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }
}

function composeDetails(...parts: readonly string[]): string {
  return parts.map((part) => part.trim()).filter(Boolean).join('، ');
}

function egyptianPhoneControl(control: AbstractControl): { phone: true } | null {
  return isEgyptianMobile(String(control.value ?? '')) ? null : { phone: true };
}

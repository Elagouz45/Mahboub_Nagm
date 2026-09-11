import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SITE_CONTACT, SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { compactPhone, isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { WHATSAPP_HELP_MESSAGE, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { CONTACT_COPY, CONTACT_DISPLAY } from '../../contact.content';
import { legacyContactRedirect } from '../../data-access/contact-query.util';
import { ContactRepository } from '../../data-access/contact.repository';
import {
  CONTACT_TYPE_LABELS,
  CONTACT_TYPES,
  ContactRequest,
  ContactSubmitResult,
  ContactType,
} from '../../models/contact.model';

function trimmedMinLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return { required: true };
    }
    return value.length < min
      ? { minlength: { requiredLength: min, actualLength: value.length } }
      : null;
  };
}

function trimmedRange(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return { required: true };
    }
    if (value.length < min) {
      return { minlength: { requiredLength: min, actualLength: value.length } };
    }
    return value.length > max
      ? { maxlength: { requiredLength: max, actualLength: value.length } }
      : null;
  };
}

function egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return { required: true };
  }
  return isEgyptianMobile(value) ? null : { egyptianPhone: true };
}

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, IconComponent, PageBreadcrumbComponent],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly repository = inject(ContactRepository);
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly contact = inject(SITE_CONTACT_CONFIG, { optional: true }) ?? SITE_CONTACT;
  private readonly productSlug = signal('');

  readonly copy = CONTACT_COPY;
  readonly types = CONTACT_TYPES;
  readonly typeLabels = CONTACT_TYPE_LABELS;
  readonly emptyType = '' as const;
  readonly breadcrumb = [{ label: 'الرئيسية', path: '/' }, { label: 'تواصل معنا' }];
  readonly whatsappUrl = buildWhatsAppUrl(inject(WHATSAPP_NUMBER), WHATSAPP_HELP_MESSAGE);
  readonly displayPhone = this.contact.phone.trim() || CONTACT_DISPLAY.phone;
  readonly phoneHref = `tel:${compactPhone(this.displayPhone)}`;
  readonly displayEmail = this.contact.email.trim() || CONTACT_DISPLAY.email;
  readonly workingHours = this.contact.workingHours.trim() || CONTACT_DISPLAY.workingHours;
  readonly address = this.contact.address?.trim() || CONTACT_DISPLAY.address;
  readonly mapUrl = this.contact.mapUrl?.trim() || CONTACT_DISPLAY.mapUrl;

  readonly form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<ContactType | ''>(this.initialType(), Validators.required),
    name: ['', [trimmedMinLength(2)]],
    phone: ['', [egyptianPhoneValidator]],
    message: ['', [trimmedRange(10, 1000)]],
  });

  readonly submitting = signal(false);
  readonly submitResult = signal<ContactSubmitResult | null>(null);
  readonly submitMessage = computed(() => {
    const result = this.submitResult();
    if (!result) {
      return '';
    }
    return typeof result === 'object' ? this.copy.success : this.copy.failure;
  });
  readonly submitStatus = computed(() => {
    const result = this.submitResult();
    if (!result) {
      return null;
    }
    return typeof result === 'object' ? 'success' : 'error';
  });

  constructor() {
    this.applyQuery(this.route.snapshot.queryParamMap);
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.applyQuery(params);
    });
    afterNextRender(() => {
      this.applyQuery(this.route.snapshot.queryParamMap);
      globalThis.setTimeout(() => {
        if (!this.destroyRef.destroyed) {
          this.syncSelectView();
        }
      });
    });
  }

  private initialType(): ContactType | '' {
    return this.readTypeParam(this.route.snapshot.queryParamMap);
  }

  private readTypeParam(params: ParamMap): ContactType | '' {
    const rawType =
      params.get('type') ??
      this.route.snapshot.queryParamMap.get('type') ??
      this.route.parent?.snapshot.queryParamMap.get('type');
    return rawType && (CONTACT_TYPES as readonly string[]).includes(rawType)
      ? (rawType as ContactType)
      : '';
  }

  private applyQuery(params: ParamMap): void {
    const redirect = legacyContactRedirect(params);
    if (redirect) {
      void this.router.navigate([redirect.path], {
        queryParams: redirect.queryParams,
        replaceUrl: true,
      });
      return;
    }

    const rawType = this.readTypeParam(params);
    if (rawType) {
      this.form.controls.type.setValue(rawType);
      this.syncSelectView();
    }
    this.productSlug.set((params.get('product') ?? '').trim());
    this.cdr.markForCheck();
  }

  private syncSelectView(): void {
    const type = this.form.controls.type.value;
    const select = this.document.querySelector<HTMLSelectElement>('select[formcontrolname="type"]');
    if (!type || !select) {
      return;
    }
    const match = Array.from(select.options).find(
      (option) => option.value === type || option.value.endsWith(`: ${type}`),
    );
    if (match) {
      select.value = match.value;
    }
  }

  fieldInvalid(name: 'type' | 'name' | 'phone' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  fieldError(name: 'type' | 'name' | 'phone' | 'message'): string {
    if (!this.fieldInvalid(name)) {
      return '';
    }
    if (name === 'name') {
      return this.copy.nameError;
    }
    if (name === 'phone') {
      return this.copy.phoneError;
    }
    if (name === 'type') {
      return this.copy.typeError;
    }
    return this.copy.messageError;
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }
    this.submitResult.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.document.querySelector<HTMLElement>('form .ng-invalid')?.focus();
      this.cdr.markForCheck();
      return;
    }
    const request = this.toRequest();
    if (!request) {
      return;
    }
    this.submitting.set(true);
    this.repository.submit(request).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.submitResult.set(result);
        if (typeof result === 'object') {
          this.form.reset({ type: '', name: '', phone: '', message: '' });
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.submitting.set(false);
        this.submitResult.set('failed');
        this.cdr.markForCheck();
      },
    });
  }

  private toRequest(): ContactRequest | null {
    const value = this.form.getRawValue();
    if (!value.type) {
      return null;
    }
    return {
      type: value.type,
      name: value.name.trim(),
      phone: compactPhone(value.phone),
      email: '',
      message: value.message.trim(),
      productSlug: this.productSlug(),
      orderNumber: '',
      deviceType: '',
      issue: '',
      complaintSubject: '',
      attachments: [],
    };
  }
}

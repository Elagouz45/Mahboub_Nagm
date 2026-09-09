import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SITE_CONTACT, SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { WHATSAPP_NUMBER } from '@core/tokens/api.tokens';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';
import { WHATSAPP_HELP_MESSAGE, buildWhatsAppUrl } from '@core/utils/whatsapp.util';
import { CatalogRepository } from '@features/catalog/data-access/catalog.repository';
import { DEFAULT_CATALOG_QUERY } from '@features/catalog/models/catalog.model';
import { AppIconName, IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTrustStripComponent } from '@shared/components/page-trust-strip/page-trust-strip.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { take } from 'rxjs';
import { CONTACT_FAQ } from '../../contact.content';
import { contactFaqTopic, legacyContactRedirect, parseContactType } from '../../data-access/contact-query.util';
import { ContactRepository } from '../../data-access/contact.repository';
import {
  CONTACT_TYPE_LABELS,
  CONTACT_TYPES,
  ContactAttachmentMeta,
  ContactRequest,
  ContactSubmitResult,
  ContactType,
} from '../../models/contact.model';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 3;

function egyptianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return { required: true };
  }
  return isEgyptianMobile(value) ? null : { egyptianPhone: true };
}

@Component({
  selector: 'app-contact-page',
  imports: [
    ReactiveFormsModule,
    IconComponent,
    SiteImageComponent,
    PageBreadcrumbComponent,
    PageTrustStripComponent,
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly repository = inject(ContactRepository);
  private readonly catalog = inject(CatalogRepository, { optional: true });
  private readonly document = inject(DOCUMENT);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contact = inject(SITE_CONTACT_CONFIG, { optional: true }) ?? SITE_CONTACT;

  readonly hero = SITE_IMAGE_ASSETS.contact.hero;
  readonly types = CONTACT_TYPES;
  readonly typeLabels = CONTACT_TYPE_LABELS;
  readonly faq = CONTACT_FAQ;
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'تواصل معنا' },
  ];
  readonly trustItems = [
    { label: 'ضمان معتمد', icon: 'shield' as const },
    { label: 'منتجات أصلية', icon: 'badge-check' as const },
    { label: 'صيانة موثوقة', icon: 'headset' as const },
  ];
  readonly purposeIcons: Readonly<Record<ContactType, AppIconName>> = {
    product: 'package',
    order: 'truck',
    maintenance: 'wrench',
    complaint: 'message',
  };
  readonly whatsappUrl = buildWhatsAppUrl(inject(WHATSAPP_NUMBER), WHATSAPP_HELP_MESSAGE);
  readonly phone = this.contact.phone.trim();
  readonly email = this.contact.email.trim();
  readonly workingHours = this.contact.workingHours.trim();
  readonly hasDirectContact = Boolean(this.phone || this.email || this.workingHours || this.whatsappUrl);

  readonly form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<ContactType>('product'),
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [egyptianPhoneValidator]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
    productSlug: [''],
    orderNumber: [''],
    deviceType: [''],
    issue: [''],
    complaintSubject: [''],
  });

  readonly files = signal<File[]>([]);
  readonly fileError = signal('');
  readonly submitting = signal(false);
  readonly submitResult = signal<ContactSubmitResult | null>(null);
  readonly openFaqId = signal<string | null>(null);
  readonly selectedType = signal<ContactType>('product');

  readonly messageLength = signal(0);
  readonly submitMessage = computed(() => {
    if (!this.submitResult()) {
      return '';
    }
    return 'تعذر إرسال الرسالة حاليًا، حاول مرة أخرى';
  });

  constructor() {
    this.applyConditionalValidators('product');
    this.form.controls.message.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.messageLength.set(value.length);
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const redirect = legacyContactRedirect(params);
      if (redirect) {
        void this.router.navigate([redirect.path], {
          queryParams: redirect.queryParams,
          replaceUrl: true,
        });
        return;
      }

      const type = parseContactType(params.get('type'));
      this.selectedType.set(type);
      this.form.controls.type.setValue(type, { emitEvent: false });
      this.applyConditionalValidators(type);

      const product = (params.get('product') ?? '').trim();
      if (product) {
        this.resolveProductSlug(product);
      }

      const faqTopic = contactFaqTopic(params.get('topic'));
      if (faqTopic) {
        const mapped =
          faqTopic === 'warranty' ? 'maintenance' : faqTopic === 'faq' ? null : faqTopic;
        this.openFaqId.set(mapped);
        this.scrollToFaq();
      }

      this.cdr.markForCheck();
    });
  }

  onSelectType(type: ContactType): void {
    this.selectedType.set(type);
    this.form.controls.type.setValue(type, { emitEvent: false });
    this.applyConditionalValidators(type);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type,
        product: this.route.snapshot.queryParamMap.get('product') || null,
        topic: this.route.snapshot.queryParamMap.get('topic') || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleFaq(id: string): void {
    this.openFaqId.set(this.openFaqId() === id ? null : id);
  }

  showAllFaq(event: Event): void {
    event.preventDefault();
    this.openFaqId.set(this.faq[0]?.id ?? null);
    this.scrollToFaq();
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = Array.from(input.files ?? []);
    input.value = '';
    if (next.length === 0) {
      return;
    }
    const combined = [...this.files(), ...next].slice(0, MAX_FILES);
    const invalid = combined.find(
      (file) => file.size > MAX_FILE_SIZE || !ALLOWED_FILE_TYPES.includes(file.type),
    );
    if (invalid) {
      this.fileError.set('الملف يجب أن يكون صورة أو PDF وحجمه حتى 5 ميجابايت.');
      return;
    }
    this.fileError.set('');
    this.files.set(combined);
  }

  removeFile(name: string): void {
    this.files.set(this.files().filter((file) => file.name !== name));
  }

  fieldInvalid(name: keyof ContactPageComponent['form']['controls']): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    this.submitResult.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.repository.submit(this.toRequest()).subscribe((result) => {
      this.submitting.set(false);
      this.submitResult.set(result);
      this.cdr.markForCheck();
    });
  }

  private toRequest(): ContactRequest {
    const value = this.form.getRawValue();
    const attachments: ContactAttachmentMeta[] = this.files().map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    return { ...value, attachments };
  }

  private applyConditionalValidators(type: ContactType): void {
    const { orderNumber, deviceType, issue, complaintSubject } = this.form.controls;
    orderNumber.clearValidators();
    deviceType.clearValidators();
    issue.clearValidators();
    complaintSubject.clearValidators();
    if (type === 'order') {
      orderNumber.setValidators([Validators.required, Validators.minLength(3)]);
    }
    if (type === 'maintenance') {
      deviceType.setValidators([Validators.required]);
      issue.setValidators([Validators.required, Validators.minLength(8)]);
    }
    if (type === 'complaint') {
      complaintSubject.setValidators([Validators.required, Validators.minLength(3)]);
    }
    orderNumber.updateValueAndValidity({ emitEvent: false });
    deviceType.updateValueAndValidity({ emitEvent: false });
    issue.updateValueAndValidity({ emitEvent: false });
    complaintSubject.updateValueAndValidity({ emitEvent: false });
  }

  private resolveProductSlug(slug: string): void {
    this.form.controls.productSlug.setValue(slug, { emitEvent: false });
    if (!this.catalog) {
      return;
    }
    this.catalog
      .search({ ...DEFAULT_CATALOG_QUERY, pageSize: 36 })
      .pipe(take(1))
      .subscribe((result) => {
        const match = result.items.find((item) => item.slug === slug);
        this.form.controls.productSlug.setValue(match?.slug ?? '', { emitEvent: false });
        this.cdr.markForCheck();
      });
  }

  private scrollToFaq(): void {
    queueMicrotask(() => {
      const target = this.document.getElementById('contact-faq');
      if (!target) {
        return;
      }
      const view = this.document.defaultView;
      const reduce =
        !view ||
        typeof view.matchMedia !== 'function' ||
        view.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  }
}

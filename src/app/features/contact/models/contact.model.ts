export const CONTACT_TYPES = ['product', 'order', 'maintenance', 'complaint'] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export interface ContactAttachmentMeta {
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

export interface ContactRequest {
  readonly type: ContactType;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly message: string;
  readonly productSlug: string;
  readonly orderNumber: string;
  readonly deviceType: string;
  readonly issue: string;
  readonly complaintSubject: string;
  readonly attachments: readonly ContactAttachmentMeta[];
}

export type ContactSubmitResult = 'unavailable' | 'failed';

export const CONTACT_TYPE_LABELS: Readonly<Record<ContactType, string>> = {
  product: 'استفسار عن منتج',
  order: 'متابعة طلب',
  maintenance: 'طلب صيانة',
  complaint: 'شكوى أو اقتراح',
};

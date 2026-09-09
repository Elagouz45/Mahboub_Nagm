import { ParamMap, Params } from '@angular/router';
import { CONTACT_TYPES, ContactType } from '../models/contact.model';

export function parseContactType(value: string | null): ContactType {
  return value && (CONTACT_TYPES as readonly string[]).includes(value) ? (value as ContactType) : 'product';
}

export function legacyContactRedirect(
  params: ParamMap,
): { readonly path: string; readonly queryParams: Params } | null {
  const topic = params.get('topic');
  if (topic === 'about') {
    return { path: '/about', queryParams: {} };
  }
  if (topic === 'after-sales') {
    return { path: '/after-sales', queryParams: {} };
  }
  if (topic === 'maintenance') {
    return { path: '/service-centers', queryParams: {} };
  }
  if (topic === 'returns' && !params.get('type')) {
    return { path: '/return-policy', queryParams: {} };
  }

  return null;
}

export function contactFaqTopic(topic: string | null): string | null {
  switch (topic) {
    case 'faq':
    case 'shipping':
    case 'returns':
    case 'warranty':
      return topic;
    default:
      return null;
  }
}

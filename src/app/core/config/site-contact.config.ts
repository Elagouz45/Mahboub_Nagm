import { InjectionToken } from '@angular/core';

export interface SiteSocialLink {
  readonly platform: 'facebook' | 'instagram' | 'youtube';
  readonly label: string;
  readonly url: string;
  readonly icon: 'facebook' | 'instagram' | 'youtube';
}

export interface SiteContactConfig {
  readonly phone: string;
  readonly email: string;
  readonly workingHours: string;
  readonly social: readonly SiteSocialLink[];
}

export const SITE_CONTACT: SiteContactConfig = {
  phone: '',
  email: '',
  workingHours: '',
  social: [],
};

export const SITE_CONTACT_CONFIG = new InjectionToken<SiteContactConfig>('SITE_CONTACT_CONFIG');

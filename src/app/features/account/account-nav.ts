import { AppIconName } from '@shared/components/icon/icon.component';

export type AccountNavBadge = 'orders' | 'favorites';

export interface AccountNavLink {
  readonly path: string;
  readonly label: string;
  readonly exact: boolean;
  readonly icon: AppIconName;
  readonly badge?: AccountNavBadge;
}

export interface AccountBreadcrumbItem {
  readonly label: string;
  readonly path?: string;
}

export const ACCOUNT_NAV_LINKS: readonly AccountNavLink[] = [
  { path: '/account', label: 'نظرة عامة', exact: true, icon: 'layout' },
  { path: '/account/orders', label: 'طلباتي', exact: false, icon: 'package', badge: 'orders' },
  { path: '/account/profile', label: 'بيانات الحساب', exact: true, icon: 'user' },
  { path: '/account/addresses', label: 'العناوين', exact: true, icon: 'map-pin' },
  { path: '/account/favorites', label: 'المفضلة', exact: true, icon: 'heart', badge: 'favorites' },
];

export function accountSectionBreadcrumb(url: string): readonly AccountBreadcrumbItem[] {
  const path = url.split(/[?#]/, 1)[0] ?? url;
  const home: AccountBreadcrumbItem = { label: 'الرئيسية', path: '/' };
  const section = ACCOUNT_NAV_LINKS.find((link) => {
    if (link.path === '/account') {
      return false;
    }
    if (link.exact) {
      return path === link.path;
    }
    return path === link.path || path.startsWith(`${link.path}/`);
  });
  if (!section) {
    return [home, { label: 'حسابي' }];
  }
  return [home, { label: 'حسابي', path: '/account' }, { label: section.label }];
}

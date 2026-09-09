import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_CONTACT, SITE_CONTACT_CONFIG } from '@core/config/site-contact.config';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { IconComponent } from '@shared/components/icon/icon.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';

@Component({
  selector: 'app-after-sales-page',
  imports: [RouterLink, IconComponent, SiteImageComponent, PageBreadcrumbComponent],
  templateUrl: './after-sales-page.component.html',
  styleUrl: './after-sales-page.component.scss',
})
export class AfterSalesPageComponent {
  private readonly contact = inject(SITE_CONTACT_CONFIG, { optional: true }) ?? SITE_CONTACT;

  readonly hero = SITE_IMAGE_ASSETS.afterSales.hero;
  readonly phone = this.contact.phone.trim();
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'خدمات ما بعد البيع' },
  ];
  readonly services = [
    {
      id: 'install',
      title: 'تركيب الأجهزة',
      description: 'مع تركيب احترافي وآمن في بيتك.',
      icon: 'bag' as const,
      link: '/contact',
      query: { type: 'maintenance' },
      action: 'اطلب التركيب',
    },
    {
      id: 'maintenance',
      title: 'طلب صيانة',
      description: 'احجز زيارة صيانة من فريقنا المعتمد.',
      icon: 'wrench' as const,
      link: '/contact',
      query: { type: 'maintenance' },
      action: 'اطلب صيانة',
    },
    {
      id: 'warranty',
      title: 'متابعة الضمان',
      description: 'استفسر عن ضمان جهازك عبر نموذج التواصل.',
      icon: 'shield' as const,
      link: '/contact',
      query: { topic: 'warranty' },
      action: 'استفسر عن الضمان',
    },
  ];
  readonly steps = [
    { title: 'اختر الخدمة', description: 'حدد نوع الخدمة التي تحتاجها.' },
    { title: 'سجّل بيانات جهازك', description: 'أدخل بيانات الجهاز وموقعك في النموذج.' },
    { title: 'نتابع معك', description: 'نؤكد الطلب ونتواصل عند توفر الخدمة.' },
  ];
}

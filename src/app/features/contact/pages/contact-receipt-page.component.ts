import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { CONTACT_TYPE_LABELS } from '../models/contact.model';

@Component({
  selector: 'app-contact-receipt-page',
  imports: [RouterLink],
  template: `
    <section class="page-container commerce-page">
      @if (!ready()) {
        <p role="status">جارٍ استرجاع الرسالة...</p>
      } @else if (message(); as item) {
        <div class="panel">
          <p class="eyebrow">سجل محلي على هذا المتصفح</p>
          <h1>{{ labels[item.type] }} — تجريبي</h1>
          <p>
            الرقم المرجعي: <strong dir="ltr">{{ item.id }}</strong>
          </p>
          <p class="demo-note">
            تم الحفظ محليًا فقط. لم تُرسل هذه الرسالة للمتجر، ولا توجد متابعة فعلية.
          </p>
          <h2>تفاصيل رسالتك</h2>
          <p>{{ item.name }} · {{ item.phone }}</p>
          @if (item.deviceType) {
            <p>الجهاز: {{ item.deviceType }}</p>
          }
          @if (item.issue) {
            <p>وصف العطل: {{ item.issue }}</p>
          }
          @if (item.orderNumber) {
            <p>رقم الطلب: {{ item.orderNumber }}</p>
          }
          @if (item.complaintSubject) {
            <p>{{ item.complaintSubject }}</p>
          }
          <p>{{ item.message }}</p>
          <p class="muted">
            احتفظ بالرابط للرجوع للرسالة من نفس المتصفح والحساب. حذف بيانات المتصفح يحذف السجل
            التجريبي.
          </p>
          <div class="actions">
            <a class="primary" [routerLink]="['/contact']">رسالة جديدة</a>
            @if (auth.isAuthenticated() && item.type === 'maintenance') {
              <a class="secondary" [routerLink]="['/account/service-requests']"
                >طلبات الصيانة بحسابي</a
              >
            }
          </div>
        </div>
      } @else {
        <div class="panel empty">
          <h1>الرسالة غير موجودة</h1>
          <p>استخدم نفس المتصفح والحساب اللذين حفظت بهما الرسالة.</p>
          <a class="primary" [routerLink]="['/contact']">العودة للتواصل</a>
        </div>
      }
    </section>
  `,
  styles: '.panel > p { line-height: 1.9; margin-block: 16px; overflow-wrap: anywhere; }',
})
export class ContactReceiptPageComponent {
  readonly reference = input.required<string>();
  readonly auth = inject(AuthStore);
  private readonly commerce = inject(DemoCommerceService);
  readonly ready = signal(false);
  readonly labels = CONTACT_TYPE_LABELS;
  readonly message = computed(() => this.commerce.message(this.reference()));
  constructor() {
    afterNextRender(() => {
      void this.auth.restoreSession().then(() => this.ready.set(true));
    });
  }
}

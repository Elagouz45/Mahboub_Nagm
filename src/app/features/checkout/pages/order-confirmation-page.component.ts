import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { DemoCommerceService } from '@core/services/demo-commerce.service';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import { formatEgp } from '@shared/utils/format-price.util';
@Component({
  selector: 'app-order-confirmation-page',
  imports: [RouterLink, SiteImageComponent],
  template: ` <section class="page-container commerce-page">
    @if (!ready()) {
      <p role="status">جارٍ استرجاع الطلب...</p>
    } @else if (order(); as item) {
      <div class="panel">
        <p class="eyebrow">تم الحفظ على هذا المتصفح</p>
        <h1>طلبك التجريبي جاهز للمراجعة</h1>
        <p>
          رقم الطلب <strong dir="ltr">{{ item.number }}</strong> · قيد المراجعة
        </p>
        <p class="demo-note">
          هذا تأكيد حفظ محلي، وليس طلب شراء فعليًا. لم يُرسل شيء للمتجر ولم تُخصم أموال.
        </p>
        <a href="#order-details" class="secondary">عرض تفاصيل الطلب</a>
      </div>
      <div class="commerce-grid" style="margin-top:24px" id="order-details">
        <section class="panel">
          <h2>تفاصيل الطلب</h2>
          @for (line of item.lines; track line.productId) {
            <div class="line">
              <div class="line-image">
                <app-site-image
                  [src]="line.imageSrc"
                  [alt]="line.imageAlt"
                  sizes="(max-width: 480px) 20vw, 10vw"
                />
              </div>
              <div class="line-copy">
                <a [routerLink]="['/products', line.slug]">{{ line.title }}</a>
                <p>{{ line.quantity }} × {{ price(line.unitPrice) }}</p>
              </div>
            </div>
          }
          <h2>عنوان التوصيل</h2>
          <p>{{ item.shippingLabel }}</p>
          <p>{{ item.paymentLabel }}</p>
        </section>
        <aside class="panel">
          <h2>ملخص المبلغ</h2>
          <div class="summary-row">
            <span>المنتجات</span><strong>{{ price(item.subtotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>الشحن التجريبي</span><strong>{{ price(item.shippingFee) }}</strong>
          </div>
          <div class="summary-row total">
            <span>الإجمالي</span><strong>{{ price(item.total) }}</strong>
          </div>
        </aside>
      </div>
      <div class="actions">
        @if (auth.isAuthenticated()) {
          <a class="secondary" [routerLink]="['/account/orders', item.id]">متابعة الطلب في حسابي</a>
        }
        <a class="primary" [routerLink]="['/products']">مواصلة التسوق</a>
      </div>
      <p class="muted">
        احتفظ برابط هذه الصفحة للرجوع للطلب من نفس المتصفح{{
          auth.isAuthenticated() ? ' والحساب' : ''
        }}. حذف بيانات المتصفح يحذف الطلبات التجريبية.
      </p>
    } @else {
      <div class="panel empty">
        <h1>الطلب غير موجود في هذه الجلسة</h1>
        <p>استخدم نفس المتصفح والحساب اللذين أنشأت بهما الطلب.</p>
        <a class="primary" [routerLink]="['/products']">العودة للمتجر</a>
      </div>
    }
  </section>`,
})
export class OrderConfirmationPageComponent {
  readonly orderId = input.required<string>();
  readonly commerce = inject(DemoCommerceService);
  readonly auth = inject(AuthStore);
  readonly ready = signal(false);
  readonly price = formatEgp;
  readonly order = computed(() => this.commerce.order(this.orderId()));
  constructor() {
    afterNextRender(() => {
      void this.auth.restoreSession().then(() => this.ready.set(true));
    });
  }
}

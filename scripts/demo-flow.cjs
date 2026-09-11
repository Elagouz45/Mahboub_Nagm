const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const axePath = process.env.AXE_SOURCE || require.resolve('axe-core/axe.min.js');
const fs = require('fs');
(async () => {
  fs.mkdirSync('.angular', { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  const audits = [];
  page.on('pageerror', (e) => {
    errors.push(e.message);
    console.log('PAGE ERROR', e.message);
  });
  page.on('console', (m) => {
    if (m.type() === 'error') {
      errors.push(m.text());
      console.log('CONSOLE ERROR', m.text());
    }
  });
  const go = async (path) => {
    await page.goto((process.env.DEMO_BASE_URL || 'http://127.0.0.1:4200') + path, {
      waitUntil: 'networkidle',
    });
    await page.getByRole('heading', { level: 1 }).waitFor();
  };
  const shot = async (name) => {
    await page.screenshot({ path: '.angular/' + name + '.png', fullPage: true });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      throw Error('Horizontal overflow: ' + name);
  };
  const axe = async (name) => {
    try {
      await page.addScriptTag({ path: axePath });
      audits.push({
        name,
        ...(await page.evaluate(async () => {
          const r = await axe.run(document.querySelector('main') ?? document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
          });
          return {
            violations: r.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
            })),
          };
        })),
      });
    } catch (e) {
      audits.push({ name, error: e.message });
    }
    fs.writeFileSync('.angular/axe-report.json', JSON.stringify(audits, null, 2));
    console.log('audit done', name);
  };
  await go('/products/lg-fridge-635');
  await page.getByRole('button', { name: 'أضف إلى السلة', exact: true }).click();
  await axe('product');
  await shot('product-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('product-mobile');
  await axe('product-mobile');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go('/cart');
  await page.getByRole('link', { name: 'متابعة لإتمام الطلب' }).waitFor();
  await shot('cart-desktop');
  await axe('cart');
  await page.getByRole('link', { name: 'متابعة لإتمام الطلب' }).click();
  await page.getByLabel('الاسم الكامل', { exact: true }).fill('أحمد محمد');
  await page.getByLabel('رقم الهاتف', { exact: true }).fill('01012345678');
  await page.getByLabel('المحافظة', { exact: true }).selectOption('cairo');
  await page.getByLabel('المدينة / المنطقة', { exact: true }).fill('مدينة نصر');
  await page.getByLabel('الشارع ورقم المبنى', { exact: true }).fill('شارع النصر 10');
  await axe('checkout-address');
  await shot('checkout-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('checkout-mobile');
  await axe('checkout-mobile');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'متابعة', exact: true }).click();
  await page.getByRole('heading', { name: 'الشحن وطريقة الدفع' }).waitFor();
  await page.getByRole('button', { name: 'متابعة', exact: true }).click();
  await page.getByRole('button', { name: 'تأكيد الطلب التجريبي' }).click();
  await page.getByRole('heading', { name: 'طلبك التجريبي جاهز للمراجعة' }).waitFor();
  const confirmation = page.url();
  await shot('confirmation-desktop');
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('confirmation-mobile');
  await axe('confirmation');
  await page.reload();
  await page.getByRole('heading', { name: 'طلبك التجريبي جاهز للمراجعة' }).waitFor();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('mahbub-najm.commerce.v1')),
  );
  if (saved.orders.length !== 1 || saved.carts.guest.length !== 0)
    throw Error('Order transaction invalid');
  await go('/auth/login');
  await page.getByRole('button', { name: 'تعبئة البيانات' }).click();
  await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
  await page.waitForURL('**/account');
  await go('/products/samsung-washer-8kg');
  await page.getByRole('button', { name: 'أضف إلى السلة', exact: true }).click();
  await go('/checkout');
  await page.getByLabel('الاسم الكامل', { exact: true }).waitFor();
  await page.getByLabel('الاسم الكامل', { exact: true }).fill('أحمد محمد');
  await page.getByLabel('رقم الهاتف', { exact: true }).fill('01012345678');
  await page.getByLabel('المحافظة', { exact: true }).selectOption('giza');
  await page.getByLabel('المدينة / المنطقة', { exact: true }).fill('الجيزة');
  await page.getByLabel('الشارع ورقم المبنى', { exact: true }).fill('شارع التحرير 12');
  await page.getByLabel('حفظ هذا العنوان بحسابي').check();
  await page.getByRole('button', { name: 'متابعة', exact: true }).click();
  await page.getByRole('button', { name: 'متابعة', exact: true }).click();
  await page.getByRole('button', { name: 'تأكيد الطلب التجريبي' }).click();
  await page.getByRole('heading', { name: 'طلبك التجريبي جاهز للمراجعة' }).waitFor();
  await page.getByRole('link', { name: 'متابعة الطلب في حسابي' }).click();
  await page.waitForURL('**/account/orders/*');
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.reload();
  await page.getByRole('heading', { level: 1 }).waitFor();
  if (!page.url().includes('/account/orders/')) throw Error('Account refresh lost session');
  await go('/contact?type=maintenance');
  await page.getByLabel('الاسم الكامل', { exact: true }).fill('أحمد محمد');
  await page.getByLabel('رقم الهاتف', { exact: true }).fill('01012345678');
  await page.getByLabel('البريد الإلكتروني', { exact: true }).fill('demo@example.com');
  await page.getByLabel('نوع الجهاز', { exact: true }).fill('غسالة');
  await page.getByLabel('وصف العطل', { exact: true }).fill('تجربة طلب فحص الجهاز');
  await page.getByLabel('الرسالة', { exact: true }).fill('هذه رسالة تجريبية لفحص جهاز منزلي');
  await axe('contact-form');
  await page.getByRole('button', { name: 'حفظ الرسالة التجريبية' }).click();
  await page.getByText(/تم حفظ الرسالة تجريبيًا/).waitFor();
  await page.getByRole('link', { name: 'عرض تفاصيل الرسالة المحفوظة' }).click();
  await page.waitForURL('**/contact/requests/*');
  await page.reload();
  await page.getByRole('heading', { level: 1 }).waitFor();
  await axe('contact-receipt');
  await go('/account/service-requests');
  await page
    .getByText(/طلب صيانة تجريبي/)
    .first()
    .waitFor();
  await shot('service-mobile');
  await axe('service-requests');
  const report = {
    guestOrder: confirmation,
    guestCheckout: true,
    accountCheckout: true,
    accountRefresh: true,
    maintenance: true,
    errors,
    audits,
  };
  fs.writeFileSync('.angular/demo-browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (errors.length || audits.some((a) => a.error || a.violations.length)) process.exitCode = 1;
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

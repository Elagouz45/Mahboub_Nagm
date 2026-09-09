import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SITE_IMAGE_ASSETS } from '@core/config/site-image-assets.config';
import { PageAccordionComponent } from '@shared/components/page-accordion/page-accordion.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTocComponent } from '@shared/components/page-toc/page-toc.component';
import { SiteImageComponent } from '@shared/components/site-image/site-image.component';
import {
  RETURN_POLICY_ACCORDION,
  RETURN_POLICY_CTA,
  RETURN_POLICY_PREP,
  RETURN_POLICY_STEPS,
  RETURN_POLICY_STORY,
  RETURN_POLICY_TOC,
} from '../../policies.content';

@Component({
  selector: 'app-return-policy-page',
  imports: [
    RouterLink,
    SiteImageComponent,
    PageBreadcrumbComponent,
    PageTocComponent,
    PageAccordionComponent,
  ],
  templateUrl: './return-policy-page.component.html',
  styleUrl: './return-policy-page.component.scss',
})
export class ReturnPolicyPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly hero = SITE_IMAGE_ASSETS.returnPolicy.hero;
  readonly story = RETURN_POLICY_STORY;
  readonly prep = RETURN_POLICY_PREP;
  readonly steps = RETURN_POLICY_STEPS;
  readonly accordion = RETURN_POLICY_ACCORDION;
  readonly toc = RETURN_POLICY_TOC;
  readonly cta = RETURN_POLICY_CTA;
  readonly openId = signal<string | null>(null);
  readonly activeId = signal<string | null>(null);
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'الاستبدال والاسترجاع' },
  ];

  constructor() {
    this.route.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      this.activeId.set(fragment);
      if (fragment && this.accordion.some((item) => item.id === fragment)) {
        this.openId.set(fragment);
      }
      this.cdr.markForCheck();
    });
  }

  toggleAccordion(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }
}

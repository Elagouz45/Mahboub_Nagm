import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageAccordionComponent } from '@shared/components/page-accordion/page-accordion.component';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { PageTocComponent } from '@shared/components/page-toc/page-toc.component';
import {
  PRIVACY_POLICY_ACCORDION,
  PRIVACY_POLICY_CTA,
  PRIVACY_POLICY_STORY,
  PRIVACY_POLICY_TOC,
  PRIVACY_POLICY_USES,
} from '../../policies.content';

@Component({
  selector: 'app-privacy-policy-page',
  imports: [RouterLink, PageBreadcrumbComponent, PageTocComponent, PageAccordionComponent],
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
})
export class PrivacyPolicyPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly story = PRIVACY_POLICY_STORY;
  readonly uses = PRIVACY_POLICY_USES;
  readonly accordion = PRIVACY_POLICY_ACCORDION;
  readonly toc = PRIVACY_POLICY_TOC;
  readonly cta = PRIVACY_POLICY_CTA;
  readonly openId = signal<string | null>(null);
  readonly activeId = signal<string | null>(null);
  readonly breadcrumb = [
    { label: 'الرئيسية', path: '/' },
    { label: 'سياسة الخصوصية' },
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

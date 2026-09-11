import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PageBreadcrumbComponent } from '@shared/components/page-breadcrumb/page-breadcrumb.component';
import { filter } from 'rxjs';
import { AccountBreadcrumbItem, accountSectionBreadcrumb } from '../../account-nav';
import { AccountSidebarComponent } from '../../ui/account-sidebar/account-sidebar.component';

@Component({
  selector: 'app-account-layout',
  imports: [RouterOutlet, PageBreadcrumbComponent, AccountSidebarComponent],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.scss',
})
export class AccountLayoutComponent {
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  breadcrumb: readonly AccountBreadcrumbItem[] = accountSectionBreadcrumb(this.router.url);

  constructor() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag('name="robots"'));
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.breadcrumb = accountSectionBreadcrumb(event.urlAfterRedirects);
        this.cdr.markForCheck();
      });
  }
}

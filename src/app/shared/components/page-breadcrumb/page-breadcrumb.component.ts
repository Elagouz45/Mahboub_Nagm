import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PageBreadcrumbItem {
  readonly label: string;
  readonly path?: string;
}

@Component({
  selector: 'app-page-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav class="page-breadcrumb" [attr.aria-label]="'مسار التنقل'">
      <ol>
        @for (item of items(); track item.label; let last = $last) {
          <li>
            @if (item.path && !last) {
              <a [routerLink]="item.path">{{ item.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .page-breadcrumb {
      margin-block-end: var(--space-4);
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li:not(:last-child)::after {
      content: '/';
      margin-inline-start: var(--space-1);
      color: var(--color-text-secondary);
    }
    a {
      color: inherit;
      min-height: var(--touch-min);
      display: inline-flex;
      align-items: center;
    }
    a:hover,
    a:focus-visible {
      color: var(--color-accent);
    }
    span[aria-current='page'] {
      color: var(--color-text-primary);
    }
  `,
})
export class PageBreadcrumbComponent {
  readonly items = input.required<readonly PageBreadcrumbItem[]>();
}

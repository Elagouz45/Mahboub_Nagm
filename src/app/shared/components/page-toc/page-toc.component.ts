import { Component, input } from '@angular/core';

export interface PageTocItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-page-toc',
  template: `
    <nav class="page-toc" [attr.aria-label]="label()">
      <h2>{{ heading() }}</h2>
      <ol>
        @for (item of items(); track item.id) {
          <li>
            <a
              [href]="'#' + item.id"
              [attr.aria-current]="activeId() === item.id ? 'location' : null"
            >
              {{ item.label }}
            </a>
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .page-toc {
      display: grid;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
    }
    h2 {
      margin: 0;
      font-size: 1rem;
    }
    ol {
      display: grid;
      gap: var(--space-1);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    a {
      display: flex;
      min-height: var(--touch-min);
      align-items: center;
      color: var(--color-text-secondary);
      border-inline-start: 3px solid transparent;
      padding-inline: var(--space-3);
    }
    a[aria-current='location'],
    a:hover,
    a:focus-visible {
      color: var(--color-primary);
      border-inline-start-color: var(--color-accent);
    }
    @media (min-width: 1024px) {
      :host {
        position: sticky;
        inset-block-start: 7.5rem;
      }
    }
    @media (max-width: 1023px) {
      ol {
        display: flex;
        gap: var(--space-2);
        overflow-x: auto;
      }
      a {
        flex: 0 0 auto;
        white-space: nowrap;
      }
    }
  `,
})
export class PageTocComponent {
  readonly heading = input('دليل الصفحة');
  readonly label = input('محتويات الصفحة');
  readonly items = input.required<readonly PageTocItem[]>();
  readonly activeId = input<string | null>(null);
}

import { Component, input } from '@angular/core';
import { AppIconName, IconComponent } from '@shared/components/icon/icon.component';

export interface PageTrustItem {
  readonly label: string;
  readonly icon: AppIconName;
}

@Component({
  selector: 'app-page-trust-strip',
  imports: [IconComponent],
  template: `
    <section class="page-trust" [attr.aria-label]="'مزايا الثقة'">
      <ul>
        @for (item of items(); track item.label) {
          <li>
            <app-icon [name]="item.icon" />
            <span>{{ item.label }}</span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .page-trust {
      margin-block-start: var(--space-10);
      padding: var(--space-5) var(--space-6);
      border-radius: var(--radius-lg);
      background: color-mix(in srgb, var(--color-primary) 6%, var(--color-background));
      border: 1px solid var(--color-border);
    }
    ul {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      min-height: var(--touch-min);
      color: var(--color-text-primary);
      font-weight: 700;
      text-align: center;
    }
    app-icon {
      color: var(--color-accent);
    }
    @media (max-width: 767px) {
      ul {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PageTrustStripComponent {
  readonly items = input.required<readonly PageTrustItem[]>();
}

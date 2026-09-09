import { Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/icon/icon.component';

export interface PageAccordionItem {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-page-accordion',
  imports: [IconComponent],
  template: `
    <ul class="page-accordion">
      @for (item of items(); track item.id) {
        <li [id]="item.id">
          <button
            type="button"
            [attr.aria-expanded]="openId() === item.id"
            [attr.aria-controls]="'accordion-' + item.id"
            (click)="toggled.emit(item.id)"
          >
            <span>{{ item.title }}</span>
            <app-icon name="chevron-down" />
          </button>
          @if (openId() === item.id) {
            <p [id]="'accordion-' + item.id">{{ item.body }}</p>
          }
        </li>
      }
    </ul>
  `,
  styles: `
    .page-accordion {
      display: grid;
      gap: var(--space-3);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      scroll-margin-block-start: 7.5rem;
    }
    button {
      display: flex;
      width: 100%;
      min-height: var(--touch-min);
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-4);
      font-weight: 700;
      text-align: start;
    }
    button:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: -2px;
    }
    button[aria-expanded='true'] app-icon {
      transform: rotate(180deg);
    }
    p {
      margin: 0;
      padding: 0 var(--space-4) var(--space-4);
    }
    @media (prefers-reduced-motion: reduce) {
      button app-icon {
        transition: none;
      }
    }
  `,
})
export class PageAccordionComponent {
  readonly items = input.required<readonly PageAccordionItem[]>();
  readonly openId = input<string | null>(null);
  readonly toggled = output<string>();
}

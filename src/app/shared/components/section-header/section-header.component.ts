import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  template: `
    <div class="section-header">
      <h2 [id]="headingId()">
        <ng-content />
        {{ title() }}
      </h2>
      @if (actionLabel() && actionLink()) {
        <a [routerLink]="actionLink()" [queryParams]="actionQuery()">{{ actionLabel() }}</a>
      }
    </div>
  `,
  styles: `
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      margin-block-end: var(--space-5);
    }
    h2 {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
      font-size: 1.35rem;
    }
    a {
      color: var(--color-accent);
      min-height: var(--touch-min);
      display: inline-flex;
      align-items: center;
    }
  `,
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly headingId = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly actionLink = input<string | undefined>(undefined);
  readonly actionQuery = input<Record<string, string> | undefined>(undefined);
}

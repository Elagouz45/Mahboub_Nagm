export function focusFirstInvalid(root: HTMLElement): void {
  const invalid = root.querySelector<HTMLElement>(
    'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, [aria-invalid="true"]',
  );
  invalid?.focus();
}

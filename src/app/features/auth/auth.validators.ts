import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isValidEmail } from '@core/utils/email.util';
import { isEgyptianMobile } from '@core/utils/egyptian-phone.util';

export function identifierValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) {
    return { identifier: true };
  }
  return isValidEmail(value) || isEgyptianMobile(value) ? null : { identifier: true };
}

export const matchControl =
  (other: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    const sibling = parent.get(other);
    return sibling && sibling.value === control.value ? null : { mismatch: true };
  };

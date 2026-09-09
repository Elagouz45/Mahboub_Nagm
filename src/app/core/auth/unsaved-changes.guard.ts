import { CanDeactivateFn } from '@angular/router';

export interface CanDeactivateDirty {
  isDirty(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanDeactivateDirty> = (component) => {
  if (!component.isDirty()) {
    return true;
  }
  return globalThis.confirm('لديك تغييرات غير محفوظة. هل تريد المغادرة دون حفظ؟');
};

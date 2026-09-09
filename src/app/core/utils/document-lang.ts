import { DOCUMENT, inject, provideAppInitializer } from '@angular/core';

export function configureDocumentLanguage(doc: Document): void {
  doc.documentElement.lang = 'ar';
  doc.documentElement.dir = 'rtl';
}

export function provideDocumentLanguage() {
  return provideAppInitializer(() => {
    configureDocumentLanguage(inject(DOCUMENT));
  });
}

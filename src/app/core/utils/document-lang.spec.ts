import { ApplicationInitStatus, DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { configureDocumentLanguage, provideDocumentLanguage } from './document-lang';

describe('document language', () => {
  it('sets Arabic language and RTL direction on the document', () => {
    const doc = document.implementation.createHTMLDocument('test');

    configureDocumentLanguage(doc);

    expect(doc.documentElement.lang).toBe('ar');
    expect(doc.documentElement.dir).toBe('rtl');
  });

  it('applies RTL configuration through the app initializer', async () => {
    TestBed.configureTestingModule({
      providers: [provideDocumentLanguage()],
    });

    await TestBed.inject(ApplicationInitStatus).donePromise;
    const doc = TestBed.inject(DOCUMENT);

    expect(doc.documentElement.lang).toBe('ar');
    expect(doc.documentElement.dir).toBe('rtl');
  });
});

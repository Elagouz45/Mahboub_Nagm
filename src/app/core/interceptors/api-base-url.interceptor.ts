import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { API_BASE_URL } from '@core/tokens/api.tokens';

const ABSOLUTE_URL = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiBaseUrl = inject(API_BASE_URL);

  if (ABSOLUTE_URL.test(req.url)) {
    return next(req);
  }

  const base = apiBaseUrl.replace(/\/$/, '');
  const path = req.url.replace(/^\//, '');

  return next(req.clone({ url: `${base}/${path}` }));
};

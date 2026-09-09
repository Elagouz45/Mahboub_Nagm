import { HttpErrorResponse } from '@angular/common/http';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { normalizeHttpError } from './http-error.util';

describe('normalizeHttpError', () => {
  it('returns the same AppError when already normalized', () => {
    const existing = {
      code: 'catalog_empty',
      message: 'لا توجد منتجات',
      status: 404,
    };

    expect(normalizeHttpError(existing)).toEqual(existing);
  });

  it('maps an HTTP 500 response to a safe Arabic server message', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      error: { stack: 'Error: boom\n    at Object.<anonymous>' },
    });

    const result = normalizeHttpError(error);

    expect(result).toEqual({
      code: 'http_500',
      message: USER_ERROR_MESSAGES.server,
      status: 500,
    });
    expect(result.message).not.toContain('boom');
    expect(result.message).not.toContain('stack');
  });

  it('uses a backend code when it is a safe string', () => {
    const error = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { code: 'product_not_found' },
    });

    expect(normalizeHttpError(error)).toEqual({
      code: 'product_not_found',
      message: USER_ERROR_MESSAGES.notFound,
      status: 404,
    });
  });

  it('maps unknown values to a generic typed error', () => {
    expect(normalizeHttpError('unexpected')).toEqual({
      code: 'unknown',
      message: USER_ERROR_MESSAGES.unknown,
    });
  });
});

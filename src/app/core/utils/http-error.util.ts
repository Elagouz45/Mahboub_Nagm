import { HttpErrorResponse } from '@angular/common/http';
import { USER_ERROR_MESSAGES } from '@core/constants/error-messages';
import { AppError, isAppError } from '@core/models/app-error.model';

export function normalizeHttpError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return {
      code: readErrorCode(error),
      message: messageForStatus(error.status),
      status: error.status || undefined,
    };
  }

  if (isNetworkError(error)) {
    return {
      code: 'network',
      message: USER_ERROR_MESSAGES.network,
    };
  }

  return {
    code: 'unknown',
    message: USER_ERROR_MESSAGES.unknown,
  };
}

function readErrorCode(error: HttpErrorResponse): string {
  const body = error.error;
  if (isRecord(body) && typeof body['code'] === 'string' && body['code'].length > 0) {
    return body['code'];
  }

  return statusToCode(error.status);
}

function messageForStatus(status: number): string {
  if (status === 0) {
    return USER_ERROR_MESSAGES.network;
  }
  if (status === 401) {
    return USER_ERROR_MESSAGES.unauthorized;
  }
  if (status === 403) {
    return USER_ERROR_MESSAGES.forbidden;
  }
  if (status === 404) {
    return USER_ERROR_MESSAGES.notFound;
  }
  if (status === 408 || status === 504) {
    return USER_ERROR_MESSAGES.timeout;
  }
  if (status === 409) {
    return USER_ERROR_MESSAGES.conflict;
  }
  if (status >= 500) {
    return USER_ERROR_MESSAGES.server;
  }

  return USER_ERROR_MESSAGES.unknown;
}

function statusToCode(status: number): string {
  if (status === 0) {
    return 'network';
  }
  if (status > 0) {
    return `http_${status}`;
  }
  return 'unknown';
}

function isNetworkError(error: unknown): boolean {
  return error instanceof Error && error.name === 'TimeoutError';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

import { InjectionToken } from '@angular/core';

/** Set to `0` in unit tests. Mock login/register wait 400–700ms when unset. */
export const MOCK_AUTH_LATENCY_MS = new InjectionToken<number>('MOCK_AUTH_LATENCY_MS');

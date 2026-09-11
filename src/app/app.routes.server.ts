import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  ...['account', 'account/**', 'auth', 'auth/**'].map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Client,
  })),
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];

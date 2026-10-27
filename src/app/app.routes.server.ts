import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'followers/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'original/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'viewdetails/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
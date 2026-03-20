import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { DataSignalService } from './core/services/data-signal';
import { Release } from './core/models/release.model';
import { Artist } from './core/models/artist.model';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'releases/:releaseRoute',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(DataSignalService);
      const releases = dataService.getData<Release>('releases')();
      return releases.map(r => ({ releaseRoute: r.releaseRoute }));
    }
  },
  {
    path: 'artists/:artistRoute',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(DataSignalService);
      const artists = dataService.getData<Artist>('artists')();
      return artists.map(a => ({ artistRoute: a.artistRoute }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

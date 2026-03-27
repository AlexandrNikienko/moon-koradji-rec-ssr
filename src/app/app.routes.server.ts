import { RenderMode, ServerRoute } from '@angular/ssr';
import releasesData from '../assets/mocks/releases.json';
import artistsData from '../assets/mocks/artists.json';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'releases/:releaseRoute',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return releasesData.releases
        .filter(r => r.releaseRoute)
        .map(r => ({ releaseRoute: r.releaseRoute }));
    }
  },
  {
    path: 'artists/:artistRoute',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return artistsData.artists
        .filter(a => !a.inactive && a.artistRoute)
        .map(a => ({ artistRoute: a.artistRoute }));
    }
  },
  {
    path: 'styles/:styleRoute',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

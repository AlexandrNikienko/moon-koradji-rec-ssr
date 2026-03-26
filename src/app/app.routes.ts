import { Route } from '@angular/router';

export const routes: Route[] = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./home/home.component').then(x => x.HomeComponent)
	},
	{
		path: 'releases',
		loadComponent: () => import('./releases/releases.component').then(x => x.ReleasesComponent)
	},
	{
		path: 'releases/:releaseRoute',
		loadComponent: () => import('./release/release.component').then(x => x.ReleaseComponent)
	},
	{
		path: 'artists',
		loadComponent: () => import('./artists/artists.component').then(x => x.ArtistsComponent)
	},
	{
		path: 'artists/:artistRoute',
		loadComponent: () => import('./artist/artist.component').then(x => x.ArtistComponent)
	},
	{
		path: 'podcasts',
		loadComponent: () => import('./podcasts/podcasts.component').then(x => x.PodcastsComponent)
	},
	{
		path: 'about',
		loadComponent: () => import('./about/about.component').then(x => x.AboutComponent)
	},
	{
		path: 'contact',
		loadComponent: () => import('./contact/contact').then(x => x.ContactComponent)
	},
	{	path: 'legal',
		loadComponent: () => import('./legal/legal').then(m => m.LegalComponent)
	},
	{ 
		path: '404',
		loadComponent: () => import('./layout/not-found/not-found').then(x => x.NotFoundComponent)
	},
  	{ 
		path: '**',
		redirectTo: '/404'
	}
];

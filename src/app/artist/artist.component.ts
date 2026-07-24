import { Artist } from './../core/models/artist.model';
import { CommonModule } from '@angular/common';
import { Component, inject, computed, effect, DestroyRef, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MetaDataService, iMeta } from './../core/services/meta-data.service';

import { HeadingComponent } from './../layout/heading/heading.component';
import { SafeHtmlPipe } from '../core/pipes/safe-html.pipe';
import { map } from 'rxjs/operators';
import { DataSignalService } from '../core/services/data-signal';
import { JsonLdService } from '../core/services/json-ld.service';
import { Release } from '../core/models/release.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReleaseCardComponent } from "../shared/release-card/release-card.component";
import { SvgIconComponent } from '../shared/svg-icon/svg-icon.component';

@Component({
    imports: [
    HeadingComponent,
    SafeHtmlPipe,
    CommonModule,
    RouterModule,
    MatTooltipModule,
    ReleaseCardComponent,
	ReleaseCardComponent,
	SvgIconComponent
],
    templateUrl: 'artist.component.html',
    styleUrls: ['artist.component.scss']
})
export class ArtistComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private dataSignalService = inject(DataSignalService);
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);

	artistRoute = toSignal(
		this.route.paramMap.pipe(map(params => params.get('artistRoute'))),
		{ initialValue: null }
	);

	private allReleases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');
	private allArtists: Signal<Artist[]> = this.dataSignalService.getData<Artist>('artists');

	artist = computed<Artist | null>(() =>
		this.allArtists().find(a => a.artistRoute === this.artistRoute()) ?? null
	);

	artistReleases = computed<Release[]>(() => {
		const artist = this.artist();
		if (!artist) return [];
		
		return this.allReleases().filter(r => 
			r.artists?.includes(artist.artistName)
		);
	});

	constructor() {
		effect(() => {
			if (
				this.allArtists().length > 0 && 
				!this.artist() && 
				this.artistRoute()
			) {
				this.router.navigate(['/404']);
			}

			const artist = this.artist();
			if (artist) {
				this.setMetaData(artist);
			}
		});
	}

	setMetaData(artist: Artist): void {
		const artistDesc = Array.isArray(artist.artistDescription)
			? artist.artistDescription.reduce((desc, par) => desc + par.paragraph + ' ', '')
			: '';		

		const metaDataObj: iMeta = {
			title: `${artist.artistName} | Moon Koradji Records`,
			description: artistDesc,
			ogTitle: artist.artistName,
			ogImage: 'https://www.moonkoradji.com/assets/images/artists/' + artist.artistAvatar,
			ogUrl: 'https://www.moonkoradji.com/artists/' + artist.artistRoute,
			ogDescription: artistDesc,
			ogType: 'profile'
		}

		// console.log('Meta data object set:', metaDataObj);

		this.metaData.setMetaData(metaDataObj);

		// JSON-LD
		this.jsonLd.setJsonLd({
			'@context': 'https://schema.org',
			'@type': 'MusicGroup',
			'@id': `https://www.moonkoradji.com/artists/${artist.artistRoute}/#artist`,
			'name': artist.artistName,
			'url': `https://www.moonkoradji.com/artists/${artist.artistRoute}`,
			'image': `https://www.moonkoradji.com/assets/images/artists/${artist.artistAvatar}`
		});
	}
}

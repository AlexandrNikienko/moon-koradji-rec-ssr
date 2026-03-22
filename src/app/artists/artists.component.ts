import { Component, inject, computed, Signal, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { DataSignalService } from '../core/services/data-signal';

import { HeadingComponent } from './../layout/heading/heading.component';
import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { Artist } from '../core/models/artist.model';
import { JsonLdService } from '../core/services/json-ld.service';

type ArtistStatus = 'All' | 'Active' | 'Inactive' | 'Featured' | 'Has Podcast';

type artistsWithLetters = Artist & { letter: string | null };

@Component({
    imports: [
		HeadingComponent,
		RouterModule,
		MatSelectModule,
		FormsModule,
	],
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['artists.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistsComponent {
	private dataSignalService = inject(DataSignalService);
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);

	private allArtists: Signal<Artist[]> = this.dataSignalService.getData<Artist>('artists');

	choosenCountries = signal<string[]>([]);
    choosenStatus = signal<ArtistStatus>('All');

	countryList = computed<{ artistCountry: string, flag: string }[]>(() => {
		// Create an array of alphabet pairs (artistCountry, flag)
		const map = new Map<string, string>();

		for (const a of this.allArtists()) {
			map.set(a.artistCountry, a.flag);
		}

		return Array.from(map.entries())
			.map(([artistCountry, flag]) => ({ artistCountry, flag }))
			.sort((a, b) => a.artistCountry.localeCompare(b.artistCountry));
	});

	statusList: ArtistStatus[] = ['All', 'Active', 'Inactive', 'Featured', 'Has Podcast'];
	
	filteredArtists = computed<Artist[]>(() => {
		const artists = this.allArtists();
		const countries = this.choosenCountries();
		const status = this.choosenStatus();

		return this.filterArtists(artists, countries, status);
	});

	artists = computed<Artist[]>(() =>
		this.filteredArtists().filter(a => a.role !== 'dj')
	);

	djs = computed<Artist[]>(() =>
		this.filteredArtists().filter(a => a.role === 'dj')
	);

	artistsWithLetters = computed<artistsWithLetters[]>(() => {
		let startLetter = '';

		return this.artists().map(artist => {
			const currentLetter = artist.artistName.charAt(0).toUpperCase();
			const letter = currentLetter !== startLetter ? currentLetter : null;
			startLetter = currentLetter;

			return {...artist, letter };
		});
	});

	featuredArtists = computed<Artist[]>(() =>
		this.allArtists().filter(a => a.featured)
	);

	constructor() {
		effect(() => {
			const all = this.allArtists();
			const featured = this.featuredArtists();
			if (!all.length || !featured.length) return;

			this.metaData.setMetaData({
				title: 'Innovative Sounds of Psychedelic Trance: Meet Our Talented Artists and DJs',
				description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko aka DJ Omsun.',
				ogTitle: 'Moon Koradji Records | World Wide Psychedelic',
				ogDescription: 'Meet our talented artists and DJs from all around the world',
				ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
				ogImageWidth: '250',
				ogImageHeight: '250',
				ogUrl: 'https://www.moonkoradji.com/artists',
				ogType: 'website'
			});

			this.jsonLd.setJsonLd({
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				'name': 'Moon Koradji Records Artists & DJs',
				'url': 'https://www.moonkoradji.com/artists',
				'numberOfItems': all.length,
				'itemListElement': featured.map((a, i) => ({
					'@type': 'ListItem',
					'position': i + 1,
					'url': `https://www.moonkoradji.com/artists/${a.artistRoute}`,
					'name': a.artistName
				}))
			});
		});
	}

	private filterArtists(
		list: Artist[], 
		countries: string[], 
		status: ArtistStatus
	): Artist[] {
		let result = list;

		if (countries.length > 0) {
			result = result.filter(a => countries.includes(a.artistCountry));
		}

		switch (status) {
			case 'Featured':
				return result.filter(a => a.featured);
			case 'Inactive':
				return result.filter(a => a.inactive);
			case 'Active':
				return result.filter(a => !a.inactive);
			case 'Has Podcast':
				return result.filter(a => (a.mixes?.length ?? 0) > 0);
			default:
				return result;
		}
	}
}

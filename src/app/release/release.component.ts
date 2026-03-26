import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { MetaDataService, iMeta } from './../core/services/meta-data.service';

import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { PictureComponent } from './../shared/picture/picture.component';
import { SharedVideoComponent } from './../shared/video/video.component';
import { HeadingComponent } from './../layout/heading/heading.component';
import { Artist } from '../core/models/artist.model';
import { Release } from '../core/models/release.model';
import { ReleaseCardComponent } from '../shared/release-card/release-card.component';
import { DataSignalService } from '../core/services/data-signal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JsonLdService } from '../core/services/json-ld.service';

@Component({
	selector: 'app-release',
	imports: [
		CommonModule,
		RouterModule,
		HeadingComponent,
		AudioPlayerComponent,
		SharedVideoComponent,
		PictureComponent,
		ReleaseCardComponent,
		MatTooltipModule
	],
	templateUrl: './release.component.html',
	styleUrls: ['release.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReleaseComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private dataSignalService = inject(DataSignalService);
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);

	releaseRoute = toSignal(
		this.route.paramMap.pipe(map(params => params.get('releaseRoute'))),
		{ initialValue: null }
	);

	allReleases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');
	allArtists: Signal<Artist[]> = this.dataSignalService.getData<Artist>('artists');

	releaseIndex = computed<number>(() =>
		this.allReleases().findIndex(r => r.releaseRoute === this.releaseRoute())
	);

	release = computed<Release | null>(() =>
		this.releaseIndex() >= 0 ? this.allReleases()[this.releaseIndex()] : null
	);

	nextRelease = computed<Release | null>(() => {
		const i = this.releaseIndex();
		return i > 0 ? this.allReleases()[i - 1] : null;
	});

	previousRelease = computed<Release | null>(() => {
		const i = this.releaseIndex();
		return i >= 0 && i < this.allReleases().length - 1 ? this.allReleases()[i + 1] : null;
	});

	involvedArtists = computed<Artist[]>(() => {
		const release = this.release();
		if (!release) return [];

		return this.allArtists().filter(a => release.artists.includes(a.artistName));
	});

	coverModalOpen = signal<boolean>(false);

	constructor() {
		effect(() => {
			if (
				this.allReleases().length > 0 &&
				this.releaseRoute() &&
				!this.release()
			) {
				this.router.navigate(['/404']);
			}

			const rel = this.release();
			if (rel) {
				this.setMetaData(rel);
			}
		});
	}

	shareOnFacebook(e: Event): void {
		e.stopPropagation();
		const release = this.release();
		if (!release) return;
		const shareUrl = 'https://www.facebook.com/sharer.php?u=' + 'https://www.moonkoradji.com/releases/' + release.releaseRoute;
		window.open(shareUrl, '_blank');
	}

	toggleCoverModal(): void {
		this.coverModalOpen.set(!this.coverModalOpen());
	}

	setJsonLdForRelease(release: Release): void {
		const releaseDesc = Array.isArray(release.releaseDescription)
			? release.releaseDescription.reduce((desc, par) => desc + par.paragraph, '')
			: '';

		const isCompilation = !!release.compiledBy || release.releaseTitle.startsWith('VA');

		const schema: any = {
			'@context': 'https://schema.org',
			'@type': 'MusicAlbum',
			'@id': `https://www.moonkoradji.com/releases/${release.releaseRoute}/#release`,
			'name': release.releaseTitle,
			'url': `https://www.moonkoradji.com/releases/${release.releaseRoute}`,
			'image': `https://www.moonkoradji.com/assets/images/release-cover/${release.releaseCover.webp2x || release.releaseCover.webp || release.releaseCover.default}`,
			'description': releaseDesc,
			'datePublished': release.releaseDate,
			'recordLabel': {
				'@id': 'https://www.moonkoradji.com/#organization'
			}
		};

		// byArtist and performer
		if (isCompilation) {
			schema['byArtist'] = {
				'@type': 'MusicGroup',
				'name': 'Various Artists'
			};
			if (release.artists?.length) {
				schema['performer'] = release.artists.map(name => ({
					'@type': 'MusicGroup',
					'name': name,
					'url': `https://www.moonkoradji.com/artists/${name.toLowerCase().replace(/\s+/g, '-')}`
				}));
			}
		} else {
			if (release.artists?.length) {
				schema['byArtist'] = release.artists.map(name => ({
					'@type': 'MusicGroup',
					'name': name,
					'url': `https://www.moonkoradji.com/artists/${name.toLowerCase().replace(/\s+/g, '-')}`
				}));
			}
		}

		// compiledBy
		if (release.compiledBy) {
			schema['producer'] = {
				'@type': 'Person',
				'name': release.compiledBy
			};
		}

		// releaseAuthor — solo releases
		if (release.releaseAuthor) {
			schema['author'] = {
				'@type': 'Person',
				'name': release.releaseAuthor
			};
		}

		// mastering credit
		if (release.masteredBy) {
			schema['creditText'] = `Mastered by ${release.masteredBy}`;
		}

		// artwork
		if (release.artworkBy) {
			schema['thumbnail'] = {
				'@type': 'ImageObject',
				'url': `https://www.moonkoradji.com/assets/images/release-cover/${release.releaseCover.default}`,
				'creditText': `Artwork by ${release.artworkBy}`,
				'creator': {
					'@type': 'Person',
					'name': release.artworkBy
				},
				'copyrightNotice': `© ${release.releaseYear} Moon Koradji Records`,
				'license': 'https://www.moonkoradji.com/legal',
				'acquireLicensePage': 'https://www.moonkoradji.com/legal'
			};
		}

		// catalog number
		if (release.releaseNumber) {
			schema['catalogNumber'] = release.releaseNumber;
		}

		// streaming links as sameAs
		const sameAs: string[] = [];
		if (release.bandcampLink) sameAs.push(release.bandcampLink);
		if (release.streamingLinks?.spotify) sameAs.push(release.streamingLinks.spotify);
		if (release.streamingLinks?.appleMusic) sameAs.push(release.streamingLinks.appleMusic);
		if (release.streamingLinks?.beatport) sameAs.push(release.streamingLinks.beatport);
		if (sameAs.length) schema['sameAs'] = sameAs;

		this.jsonLd.setJsonLd(schema);
	}

	setMetaData(release: Release): void {
		const releaseDesc = release.releaseDescription ? release.releaseDescription.reduce((desc, par) => desc + par.paragraph + ' ', '') : '';

		const metaDataObj: iMeta = {
			title: `${release.releaseTitle} | Moon Koradji Records`,
			description: releaseDesc,
			ogTitle: release.releaseTitle,
			ogImage: release.facebookShareThumb ? 
				'https://www.moonkoradji.com/assets/images/release-cover/' + release.facebookShareThumb : 
				'https://www.moonkoradji.com/assets/images/release-cover/' + (release.releaseCover.webp2x || release.releaseCover.webp || release.releaseCover.default),
			ogImageWidth: release.facebookShareThumb ? '1200' : '1000',
			ogImageHeight: release.facebookShareThumb ? '630' : '1000',
			ogUrl: 'https://www.moonkoradji.com/releases/' + release.releaseRoute,
			ogDescription: releaseDesc,
			ogType: 'music.album'
		}

		//console.log('Meta data object set:', metaDataObj);

		this.metaData.setMetaData(metaDataObj);

		this.setJsonLdForRelease(release);
	}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Signal, afterNextRender, inject } from '@angular/core';

import { DataSignalService } from '../core/services/data-signal';
import { MetaDataService } from './../core/services/meta-data.service';
import { JsonLdService } from '../core/services/json-ld.service';
import { Crystalization } from '../../assets/scripts/crystal-paralax';

import { SafeHtmlPipe } from '../core/pipes/safe-html.pipe';
import { SharedLoaderComponent } from '../shared/loader/loader.component';

@Component({
	imports: [
		CommonModule,
		SafeHtmlPipe,
		SharedLoaderComponent
	],
	selector: 'app-podcasts',
	templateUrl: './podcasts.component.html',
	styleUrls: ['podcasts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastsComponent {
	private dataSignalService = inject(DataSignalService);
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);
	private destroyRef = inject(DestroyRef);

	podcasts: Signal<any[]> = this.dataSignalService.getData<any[]>('podcasts');

	crystalization = new Crystalization();

	constructor() {
		this.metaData.setMetaData({
			title: 'Dive into the Psychedelic Soundscape: Our Podcasts on Moon Koradji Records',
			description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko aka DJ Omsun.',
			ogTitle: 'Moon Koradji Records - World Wide Psychedelic',
			ogDescription: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko aka DJ Omsun.',
			ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
			ogImageWidth: '250',
			ogImageHeight: '250',
			ogUrl: 'https://www.moonkoradji.com/podcasts',
			ogType: 'website'
		});

		this.jsonLd.setJsonLd({
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			'name': 'Moon Koradji Records Podcasts',
			'url': 'https://www.moonkoradji.com/podcasts',
			'itemListElement': [
				{
					'@type': 'ListItem',
					'position': 1,
					'item': {
						'@type': 'MusicPlaylist',
						'name': 'Moon Koradji Records Podcasts',
						'url': 'https://soundcloud.com/moon-koradji-records/sets/podcasts',
						'byArtist': {
							'@id': 'https://www.moonkoradji.com/#organization'
						}
					}
				},
				{
					'@type': 'ListItem',
					'position': 2,
					'item': {
						'@type': 'MusicPlaylist',
						'name': 'Moon Koradji Records on radiOzora',
						'url': 'https://soundcloud.com/moon-koradji-records/sets/moon-koradji-records-on',
						'byArtist': {
							'@id': 'https://www.moonkoradji.com/#organization'
						}
					}
				}
			]
		});

		afterNextRender(() => {
			this.crystalization.init();

			this.destroyRef.onDestroy(() => {
				this.crystalization.destroy();
			});
		});
	}
}

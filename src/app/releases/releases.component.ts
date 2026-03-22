import { Component, inject, Signal, effect, ChangeDetectionStrategy, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DataSignalService } from '../core/services/data-signal';
import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { ReleaseCardComponent } from './../shared/release-card/release-card.component';
import { HeadingComponent } from './../layout/heading/heading.component';
import { Release } from '../core/models/release.model';
import { JsonLdService } from '../core/services/json-ld.service';

@Component({
    imports: [
        CommonModule,
        RouterModule,
        HeadingComponent,
        ReleaseCardComponent
    ],
    selector: 'app-releases',
    templateUrl: './releases.component.html',
    styleUrls: ['releases.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleasesComponent {
	private dataSignalService = inject(DataSignalService);
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);
	
	public releases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');

	latestRelease = computed<Release | null>(() =>
		this.releases().length > 0 ? this.releases()[0] : null
	);

	constructor() {
		effect(() => {
			const latest = this.latestRelease();
			const releases = this.releases();
			if (!latest || !releases) return;

			this.metaData.setMetaData({
				title: 'Our Catalogue | Moon Koradji Records',
				description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko aka DJ Omsun.',
				ogTitle: 'Moon Koradji Records | World Wide Psychedelic',
				ogDescription: 'Enjoy Our Psychedelic Catalogue',
				ogImage: 'https://www.moonkoradji.com/assets/images/release-cover/' + (latest.releaseCover.webp || latest.releaseCover.default),
				ogImageWidth: '500',
				ogImageHeight: '500',
				ogUrl: 'https://www.moonkoradji.com/releases',
				ogType: 'website'
			});

			this.jsonLd.setJsonLd({
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				'name': 'Moon Koradji Records Catalogue',
				'url': 'https://www.moonkoradji.com/releases',
				'numberOfItems': releases.length,
				'itemListElement': releases.map((r, i) => ({
					'@type': 'ListItem',
					'position': i + 1,
					'url': `https://www.moonkoradji.com/releases/${r.releaseRoute}`,
					'name': r.releaseTitle
				}))
			});
		});
	}
}

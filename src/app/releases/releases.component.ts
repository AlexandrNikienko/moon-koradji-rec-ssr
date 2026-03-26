import { Component, inject, Signal, effect, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DataSignalService } from '../core/services/data-signal';
import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { ReleaseCardComponent } from './../shared/release-card/release-card.component';
import { HeadingComponent } from './../layout/heading/heading.component';
import { Release } from '../core/models/release.model';
import { JsonLdService } from '../core/services/json-ld.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

export type ReleaseType = 'All' | 'VA' | 'EP' | 'Album';
export type ReleaseAccess = 'All' | 'Free' | 'CD';

@Component({
    imports: [
        CommonModule,
        RouterModule,
        HeadingComponent,
        ReleaseCardComponent,
		MatSelectModule,
		FormsModule
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

	choosenType = signal<ReleaseType>('All');
	choosenAccess = signal<ReleaseAccess>('All');

	typeList: ReleaseType[] = ['All', 'VA', 'EP', 'Album'];
	accessList: ReleaseAccess[] = ['All', 'Free', 'CD'];

	filteredReleases = computed<Release[]>(() => {
		let result = this.releases();
		const type = this.choosenType();
		const access = this.choosenAccess();

		if (type !== 'All') {
			result = result.filter(r => r.releaseType === type);
		}

		if (access === 'Free') {
			result = result.filter(r => r.isFree);
		} else if (access === 'CD') {
			result = result.filter(r => r.releaseNumber?.startsWith('MKCD'));
		}

		return result;
	});

	constructor() {
		effect(() => {
			const releases = this.releases();
			if (!releases) return;

			this.metaData.setMetaData({
				title: 'Our Catalogue | Moon Koradji Records',
				description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko aka DJ Omsun.',
				ogTitle: 'Moon Koradji Records | World Wide Psychedelic',
				ogDescription: `Explore our full catalogue of ${releases.length} mind-blowing releases, featuring top-tier artists from around the globe`,
				ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
				ogImageWidth: '250',
				ogImageHeight: '250',
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

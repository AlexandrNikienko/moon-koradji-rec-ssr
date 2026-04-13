import { Component, inject, Signal, effect, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DataSignalService } from '../core/services/data-signal';
import { MetaDataService } from './../core/services/meta-data.service';
import { ReleaseCardComponent } from './../shared/release-card/release-card.component';
import { HeadingComponent } from './../layout/heading/heading.component';
import { Release } from '../core/models/release.model';
import { JsonLdService } from '../core/services/json-ld.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

export type ReleaseType = 'All' | 'VA' | 'EP' | 'Album';
export type ReleaseAccess = 'All' | 'Free' | 'CD';
export type ReleaseStyle = 'All' | 'Psychedelic Trance' | 'Dark Psytrance' | 'Forest Psytrance' | 'Twilight Psytrance' | 'Melodic Psytrance' | 'Suomi' | 'Chillout';

@Component({
    imports: [
        CommonModule,
        RouterModule,
        HeadingComponent,
        ReleaseCardComponent,
        MatSelectModule,
        MatSliderModule,
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
    choosenStyle = signal<ReleaseStyle>('All');

    typeList: ReleaseType[] = ['All', 'VA', 'EP', 'Album'];
    accessList: ReleaseAccess[] = ['All', 'Free', 'CD'];
    styleList: ReleaseStyle[] = ['All', 'Dark Psytrance', 'Forest Psytrance', 'Twilight Psytrance', 'Melodic Psytrance', 'Suomi', 'Chillout'];

    // Always from all releases — used as filter limits
    bpmBounds = computed(() => {
        const ranges = this.releases()
            .filter(r => r.bpmRange)
            .map(r => r.bpmRange!);

        return {
            min: Math.min(...ranges.map(r => r.min)),
            max: Math.max(...ranges.map(r => r.max))
        };
    });

    bpmMin = signal<number | null>(null);
    bpmMax = signal<number | null>(null);

    // From style-filtered releases only — used for BPM slider display
    bpmBoundsForStyle = computed(() => {
        let result = this.releases();
        const style = this.choosenStyle();

        if (style !== 'All') {
            result = result.filter(r =>
                r.styles?.some(s => s.split(', ').includes(style))
            );
        }

        const ranges = result
            .filter(r => r.bpmRange)
            .map(r => r.bpmRange!);

        if (!ranges.length) return { min: 0, max: 0 };

        return {
            min: Math.min(...ranges.map(r => r.min)),
            max: Math.max(...ranges.map(r => r.max))
        };
    });

    showBpmFilter = computed(() => this.choosenStyle() !== 'Chillout');

	isBpmDirty = computed(() => {
		const bounds = this.bpmBounds();
		return (
			(this.bpmMin() !== null && this.bpmMin() !== bounds.min) ||
			(this.bpmMax() !== null && this.bpmMax() !== bounds.max)
		);
	});

    filteredReleases = computed<Release[]>(() => {
        let result = this.releases();
        const type = this.choosenType();
        const access = this.choosenAccess();
        const style = this.choosenStyle();
        const bounds = this.bpmBounds();
        const bpmMin = this.bpmMin() ?? bounds.min;
        const bpmMax = this.bpmMax() ?? bounds.max;

        if (type !== 'All') {
            result = result.filter(r => r.releaseType === type);
        }

        if (access === 'Free') {
            result = result.filter(r => r.isFree);
        } else if (access === 'CD') {
            result = result.filter(r => r.releaseNumber?.startsWith('MKCD'));
        }

        if (style !== 'All') {
            result = result.filter(r =>
                r.styles?.some(s => s.split(', ').includes(style))
            );
        }

        if (this.showBpmFilter() && (bpmMin !== bounds.min || bpmMax !== bounds.max)) {
            result = result.filter(r =>
                !r.bpmRange ||
                (r.bpmRange.max >= bpmMin && r.bpmRange.min <= bpmMax)
            );
        }

		if (this.isBpmDirty()) {
			result = result.filter(r => r.styles?.[0] !== 'Chillout');
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

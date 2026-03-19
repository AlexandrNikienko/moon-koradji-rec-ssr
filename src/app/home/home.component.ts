import { Component, DestroyRef, ElementRef, Signal, computed, effect, inject, viewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { DataSignalService } from '../core/services/data-signal';
import { HeroComponent } from '../welcome/welcome.component';
import { HeadingComponent } from '../layout/heading/heading.component';
import { IMAGEFOLDER } from '../../environments/environment';
import { Release } from '../core/models/release.model';
import { PictureComponent } from '../shared/picture/picture.component';


type EventWithArtistRoutes = Event & { artists: { artistName: string; artistRoute: string }[] };

@Component({
    selector: 'mk-home',
    imports: [
        CommonModule,
        RouterModule,
        HeroComponent,
        HeadingComponent,
        PictureComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {
	private dataSignalService = inject(DataSignalService);
	private destroyRef = inject(DestroyRef);
	private metaData = inject(MetaDataService);

    coverFolder = IMAGEFOLDER + 'release-cover/';

	allReleases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');

    heroRelease: Signal<Release | undefined> = computed<Release | undefined>(() =>
		this.allReleases().find(release => release.isHero)
	);

	heroReleaseStatus: Signal<string> = computed<string>(() => {
		const release = this.heroRelease();
		if (!release || !release.releaseDate) return 'Coming Soon';
		
		try {
			// Parse date format like "February 12th, 2026"
			// Remove ordinal suffixes (st, nd, rd, th)
			const cleanedDate = release.releaseDate.replace(/(\d+)(st|nd|rd|th),/, '$1,');
			const releaseDate = new Date(cleanedDate);

			
			if (isNaN(releaseDate.getTime())) {
				return 'Coming Soon';
			}
			
			const today = new Date();
			releaseDate.setHours(12, 0, 0, 0); //12AM
			
			return releaseDate > today ? 'Coming Soon' : 'Out Now';
		} catch {
			return 'Coming Soon';
		}
	});
}

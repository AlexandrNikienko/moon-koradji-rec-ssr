import { Component, DestroyRef, ElementRef, Signal, computed, effect, inject, viewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { DataSignalService } from '../core/services/data-signal';
import { WelcomeComponent } from '../welcome/welcome.component';
import { HeadingComponent } from '../layout/heading/heading.component';
import { IMAGEFOLDER } from '../../environments/environment';
import { Release } from '../core/models/release.model';
import { PictureComponent } from '../shared/picture/picture.component';
import { HeroComponent } from './hero/hero';


type EventWithArtistRoutes = Event & { artists: { artistName: string; artistRoute: string }[] };

@Component({
    selector: 'mk-home',
    imports: [
        CommonModule,
        RouterModule,
        WelcomeComponent,
        HeadingComponent,
        PictureComponent,
		HeroComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {
	private dataSignalService = inject(DataSignalService);
	private destroyRef = inject(DestroyRef);
	private metaData = inject(MetaDataService);

	allReleases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');

    heroRelease: Signal<Release | undefined> = computed<Release | undefined>(() =>
		this.allReleases().find(release => release.isHero)
	);
}

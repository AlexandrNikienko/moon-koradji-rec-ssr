import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Signal, computed, effect, inject, viewChildren, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MetaDataService, iMeta } from './../core/services/meta-data.service';
import { DataSignalService } from '../core/services/data-signal';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeadingComponent } from '../layout/heading/heading.component';
import { Release } from '../core/models/release.model';
import { HeroComponent } from './hero/hero';
import { ReleaseCardComponent } from '../shared/release-card/release-card.component';
import { PodcastComponent } from './podcast/podcast.component';
import { Gallery } from '../core/models/gallery.model';
import { Utils } from '../core/utils';
import { SharedGalleryComponent } from '../shared/gallery/gallery.component';
import { Artist } from '../core/models/artist.model';
import { News } from '../core/models/news.model';
import { EventsComponent } from './events/events';

@Component({
    selector: 'mk-home',
    imports: [
        CommonModule,
        RouterModule,
        WelcomeComponent,
        HeadingComponent,
		HeroComponent,
        ReleaseCardComponent,
        PodcastComponent,
        SharedGalleryComponent,
        EventsComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	private dataSignalService = inject(DataSignalService);
	private destroyRef = inject(DestroyRef);
	private metaData = inject(MetaDataService);
	private platformId = inject(PLATFORM_ID);

	allReleases: Signal<Release[]> = this.dataSignalService.getData<Release>('releases');

    heroRelease: Signal<Release | undefined> = computed<Release | undefined>(() =>
		this.allReleases().find(release => release.isHero)
	);

    recentReleases: Signal<Release[]> = computed<Release[]>(() =>
		this.allReleases().filter(release => !release.isHero && !release.hidden).slice(0, 3)
	);

    releaseCards = viewChildren(ReleaseCardComponent, { read: ElementRef });

	private observer: IntersectionObserver | null = null;

    artists: Signal<Artist[]> = this.dataSignalService.getData<Artist>('artists');

	featuredArtists: Signal<Artist[]> = computed<Artist[]>(() =>
		this.artists().filter(artist => artist.featured)
	);

    featuredGalleryItems: Signal<Gallery[]> = computed<Gallery[]>(() => {
		return Utils.shuffleArray(this.featuredArtists()).map(artist => {
			const artistName = artist.artistName;

			return {
				name: artistName,
				route: `/artists/${artist.artistRoute}`,
				image: {
					default: `featured_${artistName.replace(/ /g, '_').toLocaleLowerCase()}.jpg`,
					webp: `featured_${artistName.replace(/ /g, '_').toLocaleLowerCase()}.webp`
				}
			};
		})
	});

    news: Signal<News[]> = this.dataSignalService.getData<News>('news');

	constructor() {
		effect(() => {
			if (!this.releaseCards().length) return;

			this.initScrollAnimation();

			this.releaseCards().forEach(card =>
				this.observer?.observe(card.nativeElement)
			);
		}

		// this.jsonLDService.insertSchema(this.jsonLDService.orgSchema);
		// this.metaData.setMetaData(this.metaDataObj);
	)}

    private initScrollAnimation() {
		if (!isPlatformBrowser(this.platformId)) return;
		if (this.observer) return;

		this.observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					entry.target.classList.toggle(
						'animate-in',
						entry.isIntersecting
					);
				});
			},
			{ threshold: 0.2 }
		);

		// cleanup automatically when component is destroyed
		this.destroyRef.onDestroy(() => {
			this.observer?.disconnect();
			this.observer = null;
		});
	}
}

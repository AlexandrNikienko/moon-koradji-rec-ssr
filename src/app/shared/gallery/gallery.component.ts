
import { Component, input, Inject, PLATFORM_ID, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Gallery } from '../../core/models/gallery.model';
import { PictureComponent } from '../picture/picture.component';

// @ts-ignore
import { register } from 'swiper/element/bundle';

@Component({
    selector: 'app-shared-gallery',
    imports: [CommonModule, RouterModule, PictureComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './gallery.component.html',
    styleUrls: ['gallery.component.scss'],
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedGalleryComponent implements AfterViewInit {
	items = input<Gallery[]>();
	private static registered = false;

	@ViewChild('swiperEl') swiperEl!: ElementRef;
	@ViewChild('buttonPrev') buttonPrev!: ElementRef;
	@ViewChild('buttonNext') buttonNext!: ElementRef;

	private swiperConfig = {
		spaceBetween: 30,
		loop: true, 
		breakpoints: {
			320: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
			640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
			768: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 30 },
			1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 30 }
		}
	};

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngAfterViewInit() {
		if (!isPlatformBrowser(this.platformId)) return;

		if (!SharedGalleryComponent.registered) {
			register();
			SharedGalleryComponent.registered = true;
		}

		const swiperEl = this.swiperEl.nativeElement;
		const buttonPrev = this.buttonPrev.nativeElement;
		const buttonNext = this.buttonNext.nativeElement;

		buttonPrev.addEventListener('click', () => swiperEl.swiper.slidePrev());
		buttonNext.addEventListener('click', () => swiperEl.swiper.slideNext());

		Object.assign(swiperEl, this.swiperConfig);
		swiperEl.initialize();
	}
}

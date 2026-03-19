
import { Component, OnInit, input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Gallery } from '../../core/models/gallery.model';
import { PictureComponent } from '../picture/picture.component';

// @ts-ignore
import { register } from 'swiper/element/bundle';
register();

@Component({
    selector: 'app-shared-gallery',
    imports: [CommonModule, RouterModule, PictureComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './gallery.component.html',
    styleUrls: ['swiper.scss'],
    standalone: true
})
export class SharedGalleryComponent implements OnInit {
	items = input<Gallery[]>();

	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	ngOnInit() {
		if (!isPlatformBrowser(this.platformId)) return;

		const swiperEl = document.querySelector('swiper-container') as any;
		const buttonPrev = document.querySelector('.swiper-button-prev') as any;
		const buttonNext = document.querySelector('.swiper-button-next') as any;

		if (buttonPrev) {
			buttonPrev.addEventListener('click', () => {
				//@ts-ignore
				swiperEl.swiper.slidePrev();
			});
		}

		if (buttonNext) {
			buttonNext.addEventListener('click', () => {
				//@ts-ignore
				swiperEl.swiper.slideNext();
			});
		}

		const swiperConfig = {
			//a11y: true,
			spaceBetween: 30,
			// navigation: true,
			loop: true,
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				640: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
				1024: {
					slidesPerView: 4,
					spaceBetween: 30,
				}
			}
		}

		if (swiperEl) {
			Object.assign(swiperEl, swiperConfig);

			//@ts-ignore
			swiperEl.initialize();
		}
	}
}

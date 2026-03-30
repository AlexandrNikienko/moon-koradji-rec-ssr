
import { Component, input, Inject, PLATFORM_ID, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ElementRef, viewChild } from '@angular/core';
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
export class SharedGalleryComponent implements AfterViewInit, OnDestroy {
	items = input<Gallery[]>();
	private static registered = false;

	private prevHandler!: () => void;
	private nextHandler!: () => void;

	swiperEl = viewChild<ElementRef>('swiperEl');
	buttonPrev = viewChild<ElementRef>('buttonPrev');
	buttonNext = viewChild<ElementRef>('buttonNext');

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

	constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

	ngAfterViewInit() {
		if (!isPlatformBrowser(this.platformId)) return;

		if (!SharedGalleryComponent.registered) {
			register();
			SharedGalleryComponent.registered = true;
		}

		this.prevHandler = () =>
			this.swiperEl().nativeElement.swiper.slidePrev();

		this.nextHandler = () =>
			this.swiperEl().nativeElement.swiper.slideNext();

		this.buttonPrev().nativeElement.addEventListener('click', this.prevHandler);
		this.buttonNext().nativeElement.addEventListener('click', this.nextHandler);

		Object.assign(this.swiperEl().nativeElement, this.swiperConfig);
		this.swiperEl().nativeElement.initialize();
	}

	ngOnDestroy() {
		if (!isPlatformBrowser(this.platformId)) return;

		this.buttonPrev()?.nativeElement.removeEventListener('click', this.prevHandler);
		this.buttonNext()?.nativeElement.removeEventListener('click', this.nextHandler);
	}
}

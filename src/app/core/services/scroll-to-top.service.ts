import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Utils } from '../utils';

@Injectable({
	providedIn: 'root',
})
export class ScrollTopService {
	private platformId = inject(PLATFORM_ID);

	constructor(private router: Router) {
		this.init();
	}

	init(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.router.events
				.pipe(filter((event) => event instanceof NavigationEnd))
				.subscribe((event: NavigationEnd) => {
					window.scrollY && Utils.scrollToTop();
				});
		}
	}
}

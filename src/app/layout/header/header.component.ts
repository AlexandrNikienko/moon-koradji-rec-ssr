import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgIconComponent } from "../../shared/svg-icon/svg-icon.component";
import { DataSignalService } from '@/core/services/data-signal';
import { Release } from '@/core/models/release.model';

@Component({
	imports: [RouterModule, MatTooltipModule, MatButtonModule, SvgIconComponent],
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['header.scss']
})
export class HeaderComponent {
	isHomePage = signal(true);

	private dataSignalService = inject(DataSignalService);
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
			releaseDate.setHours(9, 0, 0, 0); //9AM
			
			return releaseDate > today ? 'Coming Soon' : 'Out Now';
		} catch {
			return 'Coming Soon';
		}
	});

	constructor(private router: Router) {
		this.router.events.pipe(
			filter(e => e instanceof NavigationEnd)
		).subscribe(() => {
			this.isHomePage.set(this.router.url === '/');
		});
	}

	closeMenu(): void {
		const navbarToggler = document.querySelector<HTMLButtonElement>('.navbar-toggler');
		const navbarCollapse = document.querySelector<HTMLElement>('#navbarToggler');

		if (navbarCollapse && navbarToggler) {
			const isOpen = navbarCollapse.classList.contains('show');
			if (isOpen) {
				navbarToggler.click();
			}
		}
	}
}

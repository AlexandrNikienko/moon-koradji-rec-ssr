import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Release } from '../../core/models/release.model';
import { IMAGEFOLDER } from '../../../environments/environment';

import { PictureComponent } from '../../shared/picture/picture.component';
import { HeadingComponent } from '../../layout/heading/heading.component';
import { SvgIconComponent } from '@/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule, PictureComponent, HeadingComponent, SvgIconComponent],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
	coverFolder = IMAGEFOLDER + 'release-cover/';
    heroRelease = input<Release | undefined>();

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
}
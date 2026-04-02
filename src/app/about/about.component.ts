import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { iMeta, MetaDataService } from './../core/services/meta-data.service';
import { HeadingComponent } from "../layout/heading/heading.component";

@Component({
    imports: [RouterModule, HeadingComponent],
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss'],
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
	private metaData = inject(MetaDataService);

	private metaDataObj: iMeta = {
		title: 'Our Mission at Moon Koradji Records',
		description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko, aka DJ Omsun.',
		ogTitle: 'Moon Koradji Records - World Wide Psychedelic',
		ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
		ogUrl: 'https://www.moonkoradji.com/about',
		ogDescription: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko, aka DJ Omsun.'
	}

	constructor() {
		this.metaData.setMetaData(this.metaDataObj);
	}
}

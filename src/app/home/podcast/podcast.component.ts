import { HeadingComponent } from './../../layout/heading/heading.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from "@angular/core";

import { DataSignalService } from './../../core/services/data-signal';
import { PodcastAdv } from '../../core/models/podcast-adv.model';

@Component({
    imports: [CommonModule, RouterModule, HeadingComponent],
    selector: 'app-podcast',
    templateUrl: './podcast.component.html',
    styleUrls: ['podcast.component.scss']
})
export class PodcastComponent {
	private dataSignalService = inject(DataSignalService);

	podcast: Signal<PodcastAdv[]> = this.dataSignalService.getData<PodcastAdv>('podcast');
}

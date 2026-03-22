import { HeadingComponent } from './../../layout/heading/heading.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    imports: [CommonModule, RouterModule, HeadingComponent],
    selector: 'app-podcast',
    templateUrl: './podcast.component.html',
    styleUrls: ['podcast.component.scss'],
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastComponent {
	
}

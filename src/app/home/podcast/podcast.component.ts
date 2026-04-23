import { HeadingComponent } from './../../layout/heading/heading.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { SvgIconComponent } from "../../shared/svg-icon/svg-icon.component";

@Component({
    imports: [CommonModule, RouterModule, HeadingComponent, SvgIconComponent],
    selector: 'app-podcast',
    templateUrl: './podcast.component.html',
    styleUrls: ['podcast.component.scss'],
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PodcastComponent {
	
}

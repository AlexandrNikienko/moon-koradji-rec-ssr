import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IMAGEFOLDER } from '../../../environments/environment';
import { Cover } from '../../../../src/app/core/models/image.model';

@Component({
	selector: 'app-picture',
	templateUrl: './picture.component.html',
  	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: ['.picture { display: block; aspect-ratio: 1;} .picture img {object-fit: cover; height: 100%;}']
})
export class PictureComponent {
	cover = input.required<Cover>();
	alt = input.required<string>();
	class = input<string>();
	imageFolder = input<string>();
	IMAGEFOLDER = IMAGEFOLDER;
	priority = input<boolean>(false);
}

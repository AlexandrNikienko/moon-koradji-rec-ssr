import { RouterModule } from '@angular/router';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Release } from '../../core/models/release.model';
import { IMAGEFOLDER } from '../../../environments/environment';
import { PictureComponent } from '../picture/picture.component';

@Component({
    imports: [RouterModule, PictureComponent],
    selector: 'app-release-card',
    templateUrl: './release-card.component.html',
  	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReleaseCardComponent {
	releaseItem = input.required<Release | null>();
	
	coverFolder = IMAGEFOLDER + 'release-cover/';
}

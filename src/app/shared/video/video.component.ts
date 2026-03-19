import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';

@Component({
    imports: [SafeHtmlPipe],
    selector: 'app-shared-video',
    templateUrl: './video.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedVideoComponent {
	embedVideo = input<string>();
}

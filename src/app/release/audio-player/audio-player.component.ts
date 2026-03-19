import { SafeHtmlPipe } from '../../core/pipes/safe-html.pipe';
import { SharedLoaderComponent } from './../../shared/loader/loader.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    imports: [SharedLoaderComponent, SafeHtmlPipe],
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['audio-player.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
	embedAudio = input<string>();
}

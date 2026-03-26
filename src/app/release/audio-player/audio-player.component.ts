import { SharedLoaderComponent } from './../../shared/loader/loader.component';
import { ChangeDetectionStrategy, Component, computed, input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    imports: [SharedLoaderComponent],
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['audio-player.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioPlayerComponent {
    private sanitizer = inject(DomSanitizer);
    private platformId = inject(PLATFORM_ID);

    albumBandcampId = input<string>();

    isBrowser = isPlatformBrowser(this.platformId);

    embedUrl = computed<SafeResourceUrl | null>(() => {
        const id = this.albumBandcampId();
        console.log('Album Bandcamp ID:', id);
        if (!id) return null;

        let url = `https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=333333/linkcol=0687f5/artwork=none/transparent=true/`;
        url = this.sanitizer.bypassSecurityTrustResourceUrl(url) as string;
        console.log('Generated embed URL:', url);

        return url;
    });
}
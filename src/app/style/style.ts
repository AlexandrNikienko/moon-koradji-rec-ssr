import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { iMeta, MetaDataService } from '../core/services/meta-data.service';
import { DataSignalService } from '../core/services/data-signal';
import { toSignal } from '@angular/core/rxjs-interop';
import { Release } from '../core/models/release.model';
import { Artist } from '../core/models/artist.model';
import { map } from 'rxjs';
import { Style } from '../core/models/style.model';
import { ReleaseCardComponent } from '../shared/release-card/release-card.component';
import { HeadingComponent } from "../layout/heading/heading.component";

@Component({
  imports: [RouterModule, ReleaseCardComponent, HeadingComponent],
  templateUrl: 'style.html',
  styleUrls: ['style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

// style.component.ts
export class StyleComponent {
  private route = inject(ActivatedRoute);
  private dataSignalService = inject(DataSignalService);

  styleRoute = toSignal(
    this.route.paramMap.pipe(map(p => p.get('styleRoute'))),
    { initialValue: null }
  );

  allStyles = this.dataSignalService.getData<Style>('styles');
  allReleases = this.dataSignalService.getData<Release>('releases');
  allArtists = this.dataSignalService.getData<Artist>('artists');

  style = computed(() =>
    this.allStyles().find(s => s.styleRoute === this.styleRoute()) ?? null
  );

  styleReleases = computed(() => {
    const label = this.styleRoute()
        ?.split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') ?? '';

    return this.allReleases().filter(r => r.styles?.includes(label));
  });

  styleArtists = computed(() =>
    this.allArtists().filter(a =>
      a.styles?.includes(this.styleRoute() ?? '')
    )
  );

  relatedStyles = computed(() =>
    this.allStyles().filter(s =>
      this.style()?.relatedStyles.includes(s.styleRoute)
    )
  );

  constructor() {
    effect(() => {
      const style = this.style();
      if (!style) return;

      // this.metaData.setMetaData({
      //   title: `${style.styleName} | Moon Koradji Records`,
      //   description: style.styleDescription,
      //   ogTitle: `${style.styleName} | Moon Koradji Records`,
      //   ogDescription: style.styleDescription,
      //   ogUrl: `https://www.moonkoradji.com/styles/${style.styleRoute}`,
      //   ogType: 'website',
      //   ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
      //   ogImageWidth: '250',
      //   ogImageHeight: '250'
      // });

      // this.jsonLd.setJsonLd({
      //   '@context': 'https://schema.org',
      //   '@type': 'WebPage',
      //   'name': style.styleName,
      //   'url': `https://www.moonkoradji.com/styles/${style.styleRoute}`,
      //   'description': style.styleDescription,
      //   'isPartOf': {
      //     '@id': 'https://www.moonkoradji.com/#organization'
      //   }
      // });

      // this.jsonLd.setBreadcrumbs([
      //   { name: 'Home', url: 'https://www.moonkoradji.com' },
      //   { name: 'Styles', url: 'https://www.moonkoradji.com/styles' },
      //   { name: style.styleName, url: `https://www.moonkoradji.com/styles/${style.styleRoute}` }
      // ]);
    });
  }
}

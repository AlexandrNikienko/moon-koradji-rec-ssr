import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MetaDataService } from '../core/services/meta-data.service';
import { JsonLdService } from '../core/services/json-ld.service';
import { HeadingComponent } from '../layout/heading/heading.component';

@Component({
  selector: 'app-legal',
  imports: [HeadingComponent],
  templateUrl: './legal.html',
  styleUrls: ['./legal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalComponent {
  private metaData = inject(MetaDataService);
  private jsonLd = inject(JsonLdService);

  constructor() {
    this.metaData.setMetaData({
      title: 'Legal & Licensing | Moon Koradji Records',
      description: 'Copyright, licensing and intellectual property policy of Moon Koradji Records.',
      ogTitle: 'Legal & Licensing | Moon Koradji Records',
      ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
      ogImageWidth: '250',
      ogImageHeight: '250',
      ogUrl: 'https://www.moonkoradji.com/legal',
      ogDescription: 'Copyright, licensing and intellectual property policy of Moon Koradji Records.',
      ogType: 'website'
    });

    this.jsonLd.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Legal & Licensing',
      'url': 'https://www.moonkoradji.com/legal',
      'description': 'Copyright, licensing and intellectual property policy of Moon Koradji Records.',
      'isPartOf': {
        '@id': 'https://www.moonkoradji.com/#organization'
      }
    });
  }
}
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MetaDataService } from './../core/services/meta-data.service';
import { HeadingComponent } from "../layout/heading/heading.component";
import { JsonLdService } from '../core/services/json-ld.service';

@Component({
	imports: [RouterModule, HeadingComponent],
	templateUrl: 'about.component.html',
	styleUrls: ['about.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
	private metaData = inject(MetaDataService);
	private jsonLd = inject(JsonLdService);

	constructor() {
		this.metaData.setMetaData({
			title: 'Our Mission at Moon Koradji Records',
			description: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko, aka DJ Omsun.',
			ogTitle: 'Moon Koradji Records - World Wide Psychedelic',
			ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
			ogUrl: 'https://www.moonkoradji.com/about',
			ogDescription: 'Independent Ukrainian psytrance label founded in 2007 by Oleksandr Nikiienko, aka DJ Omsun.'
		});

		this.jsonLd.setJsonLd({
			'@context': 'https://schema.org',
			'@type': 'AboutPage',
			'@id': 'https://www.moonkoradji.com/about/#page',
			'name': 'About Moon Koradji Records',
			'url': 'https://www.moonkoradji.com/about',
			'description': 'Independent psychedelic music label Moon Koradji Records was founded in Ukraine in 2007 by Oleksandr Nikiienko, aka DJ Omsun.',
			'about': {
				'@type': 'MusicLabel',
				'@id': 'https://www.moonkoradji.com/#organization',
				'foundingDate': '2007',
				'foundingLocation': {
					'@type': 'Place',
					'name': 'Kyiv, Ukraine'
				},
				'genre': ['Psytrance', 'Forest Psy', 'Dark Psy'],
				'sameAs': [
					'https://www.facebook.com/MoonKoradjiRecords',
					'https://www.instagram.com/moonkoradjirecords',
					'https://soundcloud.com/moon-koradji-records',
					'https://www.youtube.com/user/MoonKoradji',
					'https://moonkoradjirecords.bandcamp.com',
					'https://www.beatport.com/label/moon-koradji-records/25269',
					'https://open.spotify.com/user/4gk1x57oss4st6tx32rfkpmd8',
					'https://www.discogs.com/label/114833-Moon-Koradji-Records',
					'https://www.wikidata.org/wiki/Q138770916'
				],
				'contactPoint': {
					'@type': 'ContactPoint',
					'email': 'info@moonkoradji.com',
					'contactType': 'customer service',
					'description': 'Demo submissions and A&R inquiries'
				},
				'founder': {
					'@type': 'Person',
					'@id': 'https://www.moonkoradji.com/artists/dj-omsun/#artist',
					'name': 'Oleksandr Nikiienko',
					'alternateName': 'DJ Omsun',
					'url': 'https://www.moonkoradji.com/artists/dj-omsun'
				},
				'member': [
					{
						'@type': 'OrganizationRole',
						'member': {
							'@type': 'Person',
							'name': 'Oleksandr Nikiienko',
							'alternateName': 'DJ Omsun',
							'givenName': 'Oleksandr',
							'familyName': 'Nikiienko',
							'sameAs': [
								'https://www.moonkoradji.com/artists/dj-omsun',
								'https://www.facebook.com/omsunkoradji',
								'https://soundcloud.com/moonkoradji',
								'https://www.instagram.com/omsunkoradji'
							]
						},
						'roleName': ['Founder', 'DJ']
					}
				]
			}
		});
	}
}

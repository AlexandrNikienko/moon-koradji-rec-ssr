import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface iMeta {
	title: string,
	description: string,
	ogTitle: string,
	ogImage: string,
	ogImageWidth?: string,
	ogImageHeight?: string,
	ogUrl: string,
	ogDescription: string
	ogType?: string
}

@Injectable({
	providedIn: 'root'
})
export class MetaDataService {
	private meta = inject(Meta);
	private title = inject(Title);
	private document = inject(DOCUMENT);

	setMetaData(meta: iMeta): void {
		if (!meta) {
			return;
		}
		
		this.title.setTitle(meta.title);
		this.meta.updateTag({name: 'description', content: meta.description});
		this.meta.updateTag({property: 'og:title', content: meta.ogTitle});
		this.meta.updateTag({property: 'og:image', content: meta.ogImage});
		this.meta.updateTag({property: 'og:url', content: meta.ogUrl});
		this.meta.updateTag({property: 'og:description', content: meta.ogDescription});
		if (meta.ogType) {
			this.meta.updateTag({property: 'og:type', content: meta.ogType});
		}
		if (meta.ogImageWidth) {
			this.meta.updateTag({property: 'og:image:width', content: meta.ogImageWidth});
		}
		if (meta.ogImageHeight) {
			this.meta.updateTag({property: 'og:image:height', content: meta.ogImageHeight});
		}

		// canonical
  		this.setCanonical(meta.ogUrl);
	}

	// For Google indexing
	private setCanonical(url: string): void {
		const head = this.document.head;
		let canonical = head.querySelector('link[rel="canonical"]');
		
		if (!canonical) {
			canonical = this.document.createElement('link');
			canonical.setAttribute('rel', 'canonical');
			head.appendChild(canonical);
		}
		
		canonical.setAttribute('href', url);
	}
}
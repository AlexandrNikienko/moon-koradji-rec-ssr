import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
  private document = inject(DOCUMENT);

  setJsonLd(data: object): void {
    // Remove existing json-ld script if present
    const existing = this.document.head.querySelector('script[type="application/ld+json"]#dynamic-jsonld');
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'dynamic-jsonld';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  removeJsonLd(): void {
    const existing = this.document.head.querySelector('script[type="application/ld+json"]#dynamic-jsonld');
    if (existing) {
      existing.remove();
    }
  }
}
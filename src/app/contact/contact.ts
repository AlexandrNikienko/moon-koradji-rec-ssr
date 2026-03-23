// contact.component.ts
import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MetaDataService } from '../core/services/meta-data.service';
import { JsonLdService } from '../core/services/json-ld.service';
import { HeadingComponent } from '../layout/heading/heading.component';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HeadingComponent
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private metaData = inject(MetaDataService);
  private jsonLd = inject(JsonLdService);

  status = signal<FormStatus>('idle');

  form = this.fb.group({
    name:    ['', [Validators.required, Validators.minLength(2)]],
    email:   ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor() {
    this.metaData.setMetaData({
      title: 'Contact | Moon Koradji Records',
      description: 'Get in touch with Moon Koradji Records for demo submissions, booking and general inquiries.',
      ogTitle: 'Contact | Moon Koradji Records',
      ogImage: 'https://www.moonkoradji.com/assets/images/mk_square.jpg',
      ogImageWidth: '250',
      ogImageHeight: '250',
      ogUrl: 'https://www.moonkoradji.com/contact',
      ogDescription: 'Get in touch with Moon Koradji Records for demo submissions, booking and general inquiries.',
      ogType: 'website'
    });

    this.jsonLd.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact Moon Koradji Records',
      'url': 'https://www.moonkoradji.com/contact',
      'description': 'Demo submissions, booking and general inquiries.',
      'isPartOf': {
        '@id': 'https://www.moonkoradji.com/#organization'
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');

    try {
      const response = await fetch('YOUR_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.value)
      });

      if (response.ok) {
        this.status.set('success');
        this.form.reset();
      } else {
        this.status.set('error');
      }
    } catch {
      this.status.set('error');
    }
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return `${field} is required`;
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['minlength']) return `Too short`;

    return '';
  }
}
import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'app-shared-electric-border',
	templateUrl: './electric-border.html',
    styleUrls: ['./electric-border.scss']
})
export class ElectricBorderComponent {
	@HostBinding('class.is-safari')
	public readonly isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

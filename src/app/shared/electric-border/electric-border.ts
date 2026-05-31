import { afterNextRender, Component, HostBinding, signal } from '@angular/core';

@Component({
	selector: 'app-shared-electric-border',
	templateUrl: './electric-border.html',
    styleUrls: ['./electric-border.scss']
})
export class ElectricBorderComponent {
	filterEnabled = signal(false);

	constructor() {
		afterNextRender(() => {
			this.checkPerformance();
		});
	}

	@HostBinding('class.is-safari')
	public readonly isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	private checkPerformance() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let frames = 0;
		let slowFrames = 0;
		const t = { prev: performance.now() };

		const measure = () => {
			requestAnimationFrame(() => {
				const now = performance.now();
				if (now - t.prev > 32) slowFrames++;
				t.prev = now;
				frames++;

				if (frames < 10) {
					measure();
				} else {
					this.filterEnabled.set(slowFrames < 3);
				}
			});
		};

		measure();
	}
}

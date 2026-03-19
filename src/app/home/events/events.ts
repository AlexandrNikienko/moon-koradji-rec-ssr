import { Component, computed, inject, Signal } from '@angular/core';
import { DataSignalService } from '../../core/services/data-signal';
import { Event } from '../../core/models/event.model';
import { RouterModule } from '@angular/router';

type EventWithArtistRoutes = Event & { artists: { artistName: string; artistRoute: string }[] };

@Component({
    selector: 'app-events',
    templateUrl: './events.html',
    styleUrls: ['./events.scss'],
    standalone: true,
    imports: [
        RouterModule
    ]
})
export class EventsComponent {
    private dataSignalService = inject(DataSignalService);

    events: Signal<Event[]> = this.dataSignalService.getData<Event>('events');

	futureEvents: Signal<EventWithArtistRoutes[]> = computed<EventWithArtistRoutes[]>(() => {
		const today = new Date();

		return this.events()
			.filter(e => new Date(e.endDate) >= today)
			.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
			.slice(0, 3)
			.map(event => ({
				...event,
				artists: event.artists.map(artistName => ({
					artistName,
					artistRoute: this.getArtistRoute(artistName)
				}))
			} as EventWithArtistRoutes));
	});

    constructor() {}

    private getArtistRoute(artistName: string): string {
		return `/artists/${artistName.replace(/ /g, '-').toLocaleLowerCase()}`
	}
}
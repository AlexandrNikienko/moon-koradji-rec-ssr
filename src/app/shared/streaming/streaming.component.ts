import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
	standalone: true,
	selector: 'app-streaming',
	imports: [CommonModule, SvgIconComponent],
	templateUrl: './streaming.component.html',
    styleUrls: ['./streaming.scss']
})
export class StreamingComponent {}

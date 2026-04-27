import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { HeadingComponent } from '../heading/heading.component';

@Component({
    imports: [RouterModule, HeadingComponent],
    templateUrl: './not-found.html',
    styleUrls: ['not-found.scss']
})
export class NotFoundComponent { }

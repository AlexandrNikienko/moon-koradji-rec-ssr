import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ScrollToTopComponent } from './layout/scroll-to-top/scroll-to-top.component';
import { SvgIconComponent } from './shared/svg-icon/svg-icon.component';
import { ScrollTopService } from './core/services/scroll-to-top.service';

@Component({
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ScrollToTopComponent,
    SvgIconComponent,
    MatTooltipModule,
    CommonModule
  ],
  selector: 'app-root',
  templateUrl: './app.html'
})
export class App {
  showBackground = signal(true);
  showing = signal(false);

  constructor(
    private router: Router,
    private scrollTopService: ScrollTopService
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.showing.set(false);
      }
      if (e instanceof NavigationEnd) {
        // defer showing the UI until after the current render cycle
        setTimeout(() => this.showing.set(true));

        this.showBackground.set(this.router.url !== '/podcasts');
      }
    });
  }
}

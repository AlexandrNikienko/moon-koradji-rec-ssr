import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgIconComponent } from "../../shared/svg-icon/svg-icon.component";

@Component({
    imports: [RouterModule, MatTooltipModule, MatButtonModule, SvgIconComponent],
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.scss']
})
export class HeaderComponent { 
	closeMenu(): void {
		const navbarToggler = document.querySelector<HTMLButtonElement>('.navbar-toggler');
		const navbarCollapse = document.querySelector<HTMLElement>('#navbarToggler');
		
		if (navbarCollapse && navbarToggler) {
			const isOpen = navbarCollapse.classList.contains('show');
			if (isOpen) {
				navbarToggler.click();
			}
		}
	}
}

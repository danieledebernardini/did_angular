import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { HomeComponent } from './home/home.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet, 
		RouterLink, 
		RouterLinkActive,
		HomeComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'test';
}

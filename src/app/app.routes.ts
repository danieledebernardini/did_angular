import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DidComponent } from './did/did.component';
import { VerifyComponent } from './verify/verify.component';

export const routes: Routes = [
	{ path: '',   redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'did', component: DidComponent },
	{ path: 'verify', component: VerifyComponent },
];

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client, Wallet } from 'xrpl';
import { WalletService } from '../services/wallet.service';


@Component({
	selector: 'app-home',
	standalone: true,
	imports: [],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {
	
	readonly net = 'wss://s.devnet.rippletest.net:51233/';

	constructor(
		private router: Router, 
		private walletService: WalletService
	) {}

	/**
	 * Implements page redirection to specified address.
	 */
	goTo(address: string) {
		this.router.navigateByUrl(address);
	}

	/**
	 * After reading the input 'seed', tries to connect to the corresponding
	 * wallet, and redirects to DidComponent if possible.
	 */
	async getAccount() {

		// Retrieving seed
		const seed = <HTMLInputElement> document.getElementById('seed');
		//Example: 
		//- Address 				rNScgFE77SuKUEo7d1cFJB7zJTGQTYFba1
		//- Secret					sEdTNHE5mSNPnUfvQm5uKXo3YUWf9hk
		//- Balance					100 XRP
		//- Sequence Number	96720

		// Connecting to Client
		const client = new Client(this.net);
		await client.connect();

		// Deriving wallet and redirecting
		try {
			const wallet = Wallet.fromSeed(seed.value);
			this.walletService.setWallet(wallet);

			this.goTo('/did');
		} catch(e) {
			alert(e);
		}

		// Disconnecting from client
		client.disconnect();
	}
}

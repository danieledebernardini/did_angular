import { Injectable } from '@angular/core';


@Injectable({
	providedIn: 'root'
})
export class WalletService {

	readonly net = 'wss://s.altnet.rippletest.net:51233';

	private wallet: any;

	constructor() { }

	setWallet(wallet: any) {
		this.wallet = wallet;
	}

	getWallet() {
		return this.wallet;
	}
}

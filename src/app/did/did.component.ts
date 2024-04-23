import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client, DIDSet, LedgerEntryRequest, Wallet } from 'xrpl';
import { DidService } from '../services/did.service';
import { WalletService } from '../services/wallet.service';


@Component({
	selector: 'app-did',
	standalone: true,
	imports: [],
	templateUrl: './did.component.html',
	styleUrl: './did.component.css'
})
export class DidComponent implements OnInit {
	
	readonly net = 'wss://s.altnet.rippletest.net:51233';
	
	wallet: any;
	balance: any;

	did: any;
	data: any;
	didDoc: any;
	transaction: any;


	/*
	TODO: Move 'anagraphic' form to ngForm and modify accordingly the logic.
	*/

	constructor(
		private didService: DidService,
		private router: Router, 
		private walletService: WalletService,
	) {	}

	async ngOnInit() {

		// Getters
		this.wallet = this.walletService.getWallet();

		this.did = this.didService.getDid();
		this.data = this.didService.getData();
		this.didDoc = this.didService.getDidDocument();
		this.transaction = this.didService.getTransaction();
		
		// Static setters
		this.didDoc.id = "did:xrpl:1:" + this.wallet.classicAddress;
		//this.didDoc.publicKey.id = "did:xrpl:1:" + this.wallet.classicAddress;
		this.transaction['Account'] = this.wallet.classicAddress;

		// Dynamic setters
		const client = new Client(this.net);		//Connecting to client	
		await client.connect();
		console.log('Client connected...');

		try {
			await this.readBalance(client);
			await this.readDid(client);
		} catch(error: any) {
			console.error('Error:', error.message);
		}

		client.disconnect();										// Disconnecting from client
		console.log('...Client disconnected.');

		// Disabling HTML elements
		this.setDisabled();
	}

	/**
	 * Depending on the value of this.did, defines the disabled logic of
	 * 'anagraphic' form, 'Generate DID' button and 'Delete DID' button. In
	 * particular:
	 * - If this.did === '', the function disables the 'Delete DID' button;
	 * - Otherwise, the function disables both 'anagraphic' form and 
	 * 'Generate DID' button.
	 */
	setDisabled() {

		const emptyDid = (this.did === '');

		// Anagraphic form
		const form = <HTMLFormElement> document.getElementById('anagraphic');

		for (let i = 0; i < form.elements.length; i++) {
			const element = <HTMLInputElement> form.elements[i];
			element.disabled = !emptyDid;
		}

		// Buttons
		const genButton = <HTMLButtonElement> document.getElementById('genDid');
		const delButton = <HTMLButtonElement> document.getElementById('delDid');

		genButton.disabled = !emptyDid;
		delButton.disabled = emptyDid;
	}

	/**
	 * Gets balance from this.wallet and saves it in this.balance.
	 */
	async readBalance(client: any) {
		this.balance = await client.getXrpBalance(this.wallet.classicAddress);
	}

	/**
	 * Attempts to overwirte this.did if ledger_entry returned a valid DID.
	 */
	async readDid(client: any) {

		// Requesting DID
		await this.didService.requestDid(client, this.wallet.classicAddress);
		
		// Setting did
		this.did = "did:xrpl:1:" + this.wallet.classicAddress;
	}

	/**
	 * Fills the data fields accordingly to what has been specified in the HTML
	 * inputs and returns the JSON as string.
	 */
	fillData(): string {

		// Anagraphic form
		const form = <HTMLFormElement> document.getElementById('anagraphic');
		const isValid = form.checkValidity();

		// Checking form's validity
		if(!form.checkValidity()) {
			throw new Error('Empty input in "anagrphic" form.');
		}
		
		// Setting fields
		const name = <HTMLInputElement> document.getElementById('name');
		const surname = <HTMLInputElement> document.getElementById('surname');
		const dob = <HTMLInputElement> document.getElementById('dob');
		const place = <HTMLInputElement> document.getElementById('place');
		const country = <HTMLInputElement> document.getElementById('country');

		this.data.anagraphic = {
				name: name.value,
				surname: surname.value,
				birth: [dob.value, place.value + ', ' + country.value]
		};

		// Byte conversion
		const data = JSON.stringify(this.data);

		return this.didService.jsonToBytes(data);
	}

	/**
	 * Fills the DiD Document and returns it as a string. The created document
	 * follows the specification suggested in 'https://www.w3.org/TR/did-core'.
	 * NB: NetworkID is set to '1' since we are working on the Testnet (see
	 * xrpl.org/docs/references/protocol/transactions/common-fields/#networkid-field)
	 * Input:
	 * - type: string. The type of operation which the document refers to; can be
	 *   of three types: 0 --> 'created', 1 --> 'updated', 2 --> 'deactivated'.
	 * 
	 * TODO: Move from JSON to JSON-LD
	 */
	fillDidDocument(type: number): string {

		// Checking input's validity
		if (![0, 1, 2].includes(type)) {
			throw new Error('Selected type ' + type + ' is not valid.');
		}

		const isoDateTime = this.didService.getUTC00DateTime();	//Current datetime

		// Setting fields
		switch(type) {
			case 0:
				//this.didDoc.metadata['created'] = isoDateTime;
				this.didDoc.publicKey['publicKeyHex'] = this.wallet.publicKey;
				break;
			case 1:
				//this.didDoc.metadata['updated'] = isoDateTime;
				break;
			case 2:
				//this.didDoc.metadata['deactivated'] = isoDateTime;
				break;
		}

		// Byte conversion
		const didDoc = JSON.stringify(this.didDoc);

		return this.didService.jsonToBytes(didDoc);
	}

	/**
	 * Implementation of the DIDSet transation. 
	 */
	async setDid() {
		
		// Connecting to Client
		const client = new Client(this.net);
		await client.connect();
		console.log('Client connected...');

		try {
			// Preparing transaction
			this.transaction['TransactionType'] = 'DIDSet';
			this.transaction['Data'] = this.fillData();
			this.transaction['DIDDocument'] = this.fillDidDocument(0);
			this.transaction['URI'] = this.didService.jsonToURI(
																	this.transaction['Data']);

			//const transaction = await client.autofill(this.transaction);
			//const signedTransaction = this.wallet.sign(transaction);

			// Submitting transation
			const result = await client.submitAndWait(this.transaction, { 
												autofill: true, 
												wallet: this.wallet 
											});
			//const result = await client.submitAndWait(signedTransaction.tx_blob);
			console.log(result);

			// Refreshing balance
			await this.readBalance(client);
			await this.readDid(client);
		} catch(error: any) {
			console.error('Error:', error.message);
			alert('Error: ' + error.message);
		}

		// Disconnecting from client
		client.disconnect();
		console.log('...Client disconnected.');

		// Disabling HTML elements
		this.setDisabled();
	}

	/**
	 * Implementation of the DIDDelete transaction.
	 */
	async deleteDid() {
		
		// Connecting to Client
		const client = new Client(this.net);
		await client.connect();

		// Preparing transation
		// ...

		// Submitting transaction
		// ...

		// Disconnecting from client
		client.disconnect();
	}

	logout() {
		this.router.navigateByUrl('/home');
	}
}

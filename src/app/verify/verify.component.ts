import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from 'xrpl';
import { DidService } from '../services/did.service';

@Component({
	selector: 'app-verify',
	standalone: true,
	imports: [],
	templateUrl: './verify.component.html',
	styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {

	readonly net = 'wss://s.devnet.rippletest.net:51233/';

	did: any;
	data: any;
	//didDoc: any;

	/*
	Test example:
	 - DiD			did:xrpl:2:rNScgFE77SuKUEo7d1cFJB7zJTGQTYFba1
	 - Name			Daniele
	 - Surname 	De Bernardini
	 - Dob 			07/12/1998
	 - Place 		Arzignano
	 - Country 	IT
	*/


	constructor(
		private didService: DidService,
		private router: Router,
	) {	}

	ngOnInit() {

		// Getters
		this.did = this.didService.getDid();
		this.data = this.didService.getData();
		//this.didDoc = this.didService.getDidDocument();
	}

	/**
	 * Gets input fields from the HTML form and fills did and data accordingly
	 */
	getFields() {

		// Getting input fields
		const did = <HTMLInputElement> document.getElementById('did');
		const name = <HTMLInputElement> document.getElementById('name');
		const surname = <HTMLInputElement> document.getElementById('surname');
		const dob = <HTMLInputElement> document.getElementById('dob');
		const place = <HTMLInputElement> document.getElementById('place');
		const country = <HTMLInputElement> document.getElementById('country');

		// Setting values
		this.did = did.value;
		this.data.anagraphic = {
				name: name.value,
				surname: surname.value,
				birth: [dob.value, place.value + ', ' + country.value]
			};
	}

	/**
	 * Checks if did and data are nonempty.
	 */
	isValidForm(): boolean {

		// Anagraphic form
		const form = <HTMLFormElement> document.getElementById('anagraphic');

		// Checking if no field has been filled
		//const pob = this.data.anagraphic['birth'][1].split(', ');
		//const place = pob[0];
		//const country = pob[pob.length-1];	//Ensuring no comma in place field can
																				//affect this
		
		const isEmpty = (this.data.anagraphic['name'] === '') &&
										(this.data.anagraphic['surname'] === '') &&
										(this.data.anagraphic['birth'][0] === '') &&
										(this.data.anagraphic['birth'][1] === ', ');
										//(place === '') && (country === '');

		const isValid = form.checkValidity() && !isEmpty; //true if did is filled
																											//and at least one other
																											//input is nonempty

		return isValid;
	}

	/**
	 * Clears all input fields in the HTML form.
	 */
	clearFields() {

		// Getting input fields
		const did = <HTMLInputElement> document.getElementById('did');
		const name = <HTMLInputElement> document.getElementById('name');
		const surname = <HTMLInputElement> document.getElementById('surname');
		const dob = <HTMLInputElement> document.getElementById('dob');
		const place = <HTMLInputElement> document.getElementById('place');
		const country = <HTMLInputElement> document.getElementById('country');

		did.value = '';
		name.value = '';
		surname.value = '';
		dob.value = '';
		place.value = '';
		country.value = '';
	}

	/**
	 * Performs the verification of given data w.r.t. provided DiD. That is,
	 * extracts the nonempty fields in this.data and check the correspondence
	 * w.r.t. the given did data.
	 */
	async verify(client: any): Promise<boolean> {

		// Checking input fields' validity
		if(!this.isValidForm()) {
			throw new Error(
				'DiD field must be filled and at least ' + 
				'one of the other inputs must be nonempty.'
			);
		}

		// DiD request
		const address = this.did.replace('did:xrpl:2:', '');
		const didRequest = await this.didService.requestDid(client, address);

		// DiD data
		const did = didRequest.result['node'];
		const didData = this.didService.bytesToJson(did['Data']);

		// Verifying correspondence of nonempty fields
		const checkArray = [
				(this.data.anagraphic['name'] === '') ||
					(this.data.anagraphic['name'] === didData.anagraphic['name']),
				(this.data.anagraphic['surname'] === '') ||
					(this.data.anagraphic['surname'] === didData.anagraphic['surname']),
				(this.data.anagraphic['birth'][0] === '') ||
					(this.data.anagraphic['birth'][0] === didData.anagraphic['birth'][0]),
				didData.anagraphic['birth'][1].includes(this.data.anagraphic['birth'][1])
			];
		const isVerified = checkArray.reduce((ver, bool) => ver && bool, true);
		
		return isVerified;
	}

	/**
	 * Wrapper function for varificaion purposes.
	 */
	async verifyDid(event: any) {

		// Disabling button
		const genButton = event.currentTarget;
		genButton.disabled = true;

		// Connecting to Client
		const client = new Client(this.net);
		await client.connect();
		console.log('Client connected...');

		try {

			// Filling this.did and this.data
			this.getFields();
			
			// Getting verification result
			const result = await this.verify(client);
			const outcome = result 
											? 'Success, data corresponds to given DiD!' 
											: 'Error, some data don not correspond to the given DiD';
			alert(outcome);

			// Clearing fields
			this.clearFields();
		} catch(error: any) {
			console.error('Error:', error.message);
			alert('Error: ' + error.message);
		}

		// Disconnecting from client
		client.disconnect();
		console.log('...Client disconnected.');

		// Enabling button
		genButton.disabled = false;
	}

	back() {
		this.router.navigateByUrl('/home');
	}
}

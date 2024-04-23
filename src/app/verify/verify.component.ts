import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

	}

	/**
	 * Checks if did and data are nonempty.
	 */
	isValidForm(): boolean {
		return true;
	}

	/**
	 * Clears all input fields in the HTML form.
	 */
	clearFields() {

	}

	/**
	 * Performs the verification of given data w.r.t. provided DiD.
	 */
	async verify() {

		// Filling this.did and this.data
		this.getFields();

		try{

			// Checking input fields' validity
			if(this.isValidForm()) {
				//...
			}
		} catch(error: any) {
			console.error('Error:', error.message);
			alert('Error: ' + error.message);
		}
	}

	back() {
		this.router.navigateByUrl('/home');
	}
}

import { Injectable } from '@angular/core';

import { hexToBytes, stringToHex } from '@xrplf/isomorphic/utils';


@Injectable({
	providedIn: 'root'
})
export class DidService {

	private data: {
		"anagraphic" : {
			"name" : string;
			"surname" : string;
			"birth" : [
				string,
				string
			];
		};
	};

	private didDoc: {
		"@context" : string;
		"id" : string;
		"publicKey" : {
			"id" : string;
			"type" : [
				string,
				string
			];
			"curve" :  string;
			//"expires" :  number;
			"publicKeyHex" : string;
		};
		"metadata" : {
			"created" : string,
			"updated" : string,
			"deactivated" : string,
		};
	};

	private transaction: {
		"TransactionType" : string;
		"Account" : string;
		"URI" : string;
		"Data" : string;
		"DIDDocument" : string;
	};

	constructor() {

		// Instantiating data
		this.data = {
			"anagraphic" : {
				"name" : "",
				"surname" : "",
				"birth" : ["", ""],
			}
		}

		// Instantiating DiD document
		this.didDoc = {
			'@context': "https://www.w3.org/ns/did/v1",
			"id" : "",
			"publicKey" : {
				"id" : "",
				"type" : [
					"CryptographicKey",
					"EcdsaKoblitzPublicKey"
				],
				"curve" :  "secp256k1",
				//"expires" :  15674657,
				"publicKeyHex" : "",
			},
			"metadata" : {
				"created" : "",
				"updated" : "",
				"deactivated" : "",
			},
		};

		// Instantiating transaction
		this.transaction = {
			"TransactionType" : "",
			"Account" : "",
			"URI" : "",
			"Data" : "",
			"DIDDocument" : "",
		};
	}

	getData() {
		return this.data;
	}

	getDidDocument() {
		return this.didDoc;
	}

	getTransaction() {
		return this.transaction;
	}

	checkBytes(data: string): boolean {
		
		const bytes = hexToBytes(stringToHex(data));

		return bytes.length <= 256;
	}

	/**
	 * Returns a string for the current date, formatted as an XML Datetime
	 * normalized to UTC 00:00:00 and without sub-second decimal precision. 
	 */
	getUTC00DateTime(): string {
		
		const dateTime = new Date();
		const isoDateTime = dateTime.toISOString();	//ISO 8601 formatted string

		return isoDateTime.slice(0, 19) + 'Z';
	}

	/**
	 * Given a JSON variable, already converted to string, creates the
	 * corresponding URI transforming the given string in base 64.
	 */
	jsonToURI(json: string): string {

		const uri = 'did/json;base64,' + btoa(json);
		const validURI = this.checkBytes(uri);

		if(validURI) {
			return uri;
		} else {
			console.error('URI length exceedes max length (256 bytes).');
			return '';
		}
	}
}
import { Injectable } from '@angular/core';

import { hexToBytes, stringToHex } from '@xrplf/isomorphic/utils';
import { gzip, inflate } from 'pako';


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

	private didDoc: {							//Commented lines due to bytes constraint
		"@context" : string;
		"id" : string;
		"publicKey" : {
			//"id" : string;
			"type" : //[
				//string,
				string;
			//];
			"curve" :  string;
			//"expires" :  number;
			"publicKeyHex" : string;
		};
		//"metadata" : {
		//	"created" : string,
		//	"updated" : string,
		//	"deactivated" : string,
		//};
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
				//"id" : "",
				"type" : //[
					//"CryptographicKey",
					"EcdsaKoblitzPublicKey",
				//],
				"curve" :  "secp256k1",
				//"expires" :  15674657,
				"publicKeyHex" : "",
			},
			//"metadata" : {
			//	"created" : "",
			//	"updated" : "",
			//	"deactivated" : "",
			//},
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

	/**
	 * Compresses a JSON variable into a string
	 */
	/*
	compress(data: any): string {

		const zippedData = gzip(JSON.stringify(data));

		// Convert compressed data (Uint8Array) to a string
		return String.fromCharCode.apply(null, Array.from(zippedData));
	}
	*/

	/**
	 * Decompresses a string representing a JSON variable.
	 */
	/*
	decompress(zippedStr: string): any {
		
		// Convert string to Uint8Array
		const zippedData = new Uint8Array(
												zippedStr.split('').map(char => char.charCodeAt(0)));
		
		// Decompress data and parse to JSON
		return JSON.parse(inflate(zippedData, { to: 'string' }));
	}
	*/

	/**
	 * Converts a given string to a byte array and checks if it is a valid string
	 * (less than 256 bytes long).
	 */
	checkBytes(data: string): boolean {
		
		const bytes = hexToBytes(stringToHex(data));
		console.log('[checkBytes] bytes = ' + bytes.length);

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

		// Error handling
		if(!validURI) {
			throw new Error('URI length exceedes max length (256 bytes).');
		}
		
		return uri;
	}
}
import { Injectable } from '@angular/core';

import { hexToBytes, stringToHex } from '@xrplf/isomorphic/utils';
//import { gzip, inflate } from 'pako';


@Injectable({
	providedIn: 'root'
})
export class DidService {

	private did: string;

	private data: {
		"anagraphic" : {
			"name" : string;
			"surname" : string;
			"birth" : [
				string,		//Date
				string		//Place
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

		// Instatiating did
		this.did = "";

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

	getDid() {
		return this.did;
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
	 * Given a JSON variable json, returns its byte representation as string.
	 */
	jsonToBytes(json: string): string {

		// Convert JSON string to hexadecimal string
		const hexString = stringToHex(json);

		// Error handling
		const bytes = new Uint8Array(hexToBytes(hexString));	//Convert hex string
																													//to Uint8Array
		if (bytes.length > 256) {
				throw new Error(
					'[jsonToBytes] Input byte length (' + bytes.length
					+ ') exceeds max length (256 bytes).'
				);
		}

		return hexString;
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
	 * Given a JSON variable as hexadecimal string, creates a corresponding URI.
	 */
	jsonToURI(json: string): string {

		const uri = 'did/json;base16,' + json;	//btoa(json) for base 64

		// Byte conversion
		return this.jsonToBytes(uri);
	}

	/**
	 * Performs a ledger_entry request in order to retrieve a DID for the
	 * specified address.
	 */
	async requestDid(client: any, address: string) {

		const response = await client.request({
			command: 'ledger_entry',
			did: address,
			ledger_index: 'validated',
		});
		console.log('[requestDid] Response:\n' + response);
	}
}
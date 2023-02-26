import {Reader} from "./Reader.mjs";


/** @module MDX */
export class Key {
	/** @type {Reader} */ reader;

	/** @param {number} key */
	constructor(key) {
		
		this.key = key;
	}

	read() {
		super.read();
		if (this.value !== this.key) {
			throw new Error(`Key error: ${Reader.int2s(this.value)} != ${Reader.int2s(this.key)}`);
		}
	}

	toJSON() {
		return {
			value: this.value,
			name: Reader.int2s(this.value),
		}
	}
}
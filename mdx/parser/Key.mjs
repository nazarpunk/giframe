import {Reader} from "./Reader.mjs";
import {Uint} from "./Uint.mjs";

/** @module MDX */
export class Key extends Uint {
	/** @type {Reader} */ reader;

	/** @param {number} key */
	constructor(key) {
		super(4);
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
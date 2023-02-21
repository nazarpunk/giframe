import {hex2s} from "../type/hex.mjs";

/** @module MDX */
export class Key {
	/** @param {number} key */
	constructor(key) {
		this.key = key;
	}

	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint32();
		this.reader.next32();
		if (this.value !== this.key) {
			console.error(`Key error ${this.key} != ${this.value}`);
		}

	}

	write() {
		this.reader.setUint32(this.value);
	}

	toJSON() {
		return {
			value: this.value,
			name: hex2s(this.value),
		}
	}
}
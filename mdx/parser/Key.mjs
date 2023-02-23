import {int2s} from "../util/hex.mjs";

/** @module MDX */
export class Key {
	/** @param {number} key */
	constructor(key) {
		this.key = key;
	}

	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint32();
		this.reader.readOffsetAdd(4);
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
			name: int2s(this.value),
		}
	}
}
/** @module MDX */

import {FLOAT} from "./FLOAT.mjs";
import {WORD} from "./WORD.mjs";
import {BYTE} from "./BYTE.mjs";

export class VECTOR {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 * @param {boolean} word
	 * @param {boolean} byte
	 */
	constructor(reader, length, {word = false, byte = false} = {}) {
		this.length = length;
		for (let i = 0; i < length; i++) {
			if (word) {
				this.value.push(new WORD(reader));
			} else if (byte) {
				this.value.push(new BYTE(reader));
			} else {
				this.value.push(new FLOAT(reader));
			}
		}
	}

	/** @type {FLOAT|WORD[]} */ value = [];

	write() {
		for (let i = 0; i < this.length; i++) {
			this.value[i].write();
		}
	}
}
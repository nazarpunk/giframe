import {FLOAT} from "./FLOAT.mjs";

export class VECTOR {
	/**
	 * @param {Reader} reader
	 * @param {number} length
	 */
	constructor(reader, length) {
		this.length = length;
		for (let i = 0; i < length; i++) {
			this.value.push(new FLOAT(reader));
		}
	}

	/** @type {FLOAT[]} */ value = [];

	write() {
		for (let i = 0; i < this.length; i++) {
			this.value[i].write();
		}
	}
}
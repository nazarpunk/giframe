import {KEY} from "../type/KEY.mjs";

/** @module MDX */
export class Format {
	/**
	 * @param {Reader} reader
	 * @param {string} keyName
	 * @return {?Format}
	 */
	static fromKey(reader, keyName) {
		const key = new KEY(reader, {offset: 0});
		return key.name === keyName ? new Format(new KEY(reader)) : null;
	}

	/** @param {KEY} key */
	constructor(key) {
		this.key = key;
	}

	write() {
		this.key.write();
	}
}
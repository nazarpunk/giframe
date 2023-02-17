/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {KEY} from "../type/KEY.mjs";

export class Version {
	/**
	 * @param {Reader} reader
	 * @param {string} keyName
	 * @return {?Version}
	 */
	static fromKey(reader, keyName) {
		const key = new KEY(reader, {offset: 0});
		return key.name === keyName ? new Version(new KEY(reader)) : null;
	}

	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		this.version = new DWORD(r);
		r.version = this.version.value;
		console.log('version', r.version);
		this.chunkSize.check();
	}

	write() {
		this.key.write();
		this.chunkSize.save();
		this.version.write();
		this.chunkSize.write();
	}
}

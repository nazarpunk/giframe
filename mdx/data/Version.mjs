/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class Version {
	/** @param {KEY} key */
	constructor(key) {
		const m = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(m, {chunk: true});
		this.version = new DWORD(m);
		console.log('version', this.version.value);
		this.chunkSize.check();
	}

	write() {
		this.key.write();
		this.chunkSize.save();
		this.version.write();
		this.chunkSize.write();
	}
}

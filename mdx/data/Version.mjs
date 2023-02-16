import {DWORD} from "../type/DWORD.mjs";

export class Version {
	/** @param {DWORD} key */
	constructor(key) {
		const m = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(m);
		this.version = new DWORD(m);
	}
	write() {
		this.key.write();
		this.ChunkSize.write();
		this.version.write();
	}
}

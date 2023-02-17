import {DWORD} from "../type/DWORD.mjs";

export class GlobalSequences {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const n = this.ChunkSize.value / 4;
		for (let i = 0; i < n; i++) {
			this.durations.push(new DWORD(r));
		}
	}

	/** @type {DWORD[]} */ durations = [];

	write() {
		this.key.write();
		this.ChunkSize.writeValue(this.durations.length * 4);
		for (const d of this.durations) {
			d.write();
		}
	}
}
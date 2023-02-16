import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";

export class PivotPoints {
	/**
	 *  @param {DWORD} key
	 */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const num = this.ChunkSize.value / 12;
		for (let i = 0; i < num; i++) {
			this.points.push(new VECTOR(r, 3));
		}
	}

	/** @type {VECTOR[]} */ points = [];

	write() {
		this.key.write();
		this.ChunkSize.writeValue(this.points.length * 12);
		for (const p of this.points) {
			p.write();
		}
	}
}
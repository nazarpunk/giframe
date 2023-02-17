/** @module MDX */

import {VECTOR} from "../type/VECTOR.mjs";

export class PivotPoint {
	/** @param {Reader} reader */
	constructor(reader) {
		this.point = new VECTOR(reader, 3);
	}

	write() {
		this.point.write();
	}
}
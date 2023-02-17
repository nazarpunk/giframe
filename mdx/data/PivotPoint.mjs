/** @module MDX */

import {FLOAT} from "../type/FLOAT.mjs";

export class PivotPoint {
	/** @param {Reader} reader */
	constructor(reader) {
		this.point = new FLOAT(reader, 3);
	}

	write() {
		this.point.write();
	}
}
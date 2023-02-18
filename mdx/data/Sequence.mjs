/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class Sequence {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.name = new CHAR(reader, 80);
		this.intervalStart = new DWORD(reader);
		this.intervalEnd = new DWORD(reader);
		this.moveSpeed = new FLOAT(reader);
		this.flags = new DWORD(reader);
		this.rarity = new FLOAT(reader);
		this.syncPoint = new DWORD(reader);
		this.boundsRadius = new FLOAT(reader);
		this.minimumExtent = new FLOAT(reader, 3);
		this.maximumExtent = new FLOAT(reader, 3);
	}

	write() {
		this.name.write();
		this.intervalStart.write();
		this.intervalEnd.write();
		this.moveSpeed.write();
		this.flags.write();
		this.rarity.write();
		this.syncPoint.write();
		this.boundsRadius.write();
		this.minimumExtent.write();
		this.maximumExtent.write();
	}
}
/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class CollisionShape {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		this.type = new DWORD(reader);

		const list = [2, 0, 1];
		for (let i = 0; i < list[this.type.value]; i++) {
			this.positions.push(new FLOAT(reader, 3));
		}

		if (this.type.value === 2) {
			this.BoundsRadius = new FLOAT(reader);
		}
	}

	/** @type {DWORD} */ type;

	/** @type {FLOAT[]} */
	positions = [];

	write() {
		this.node.write();
		this.type.write();
		for (const p of this.positions) {
			p.write();
		}
		this.BoundsRadius?.write();
	}
}


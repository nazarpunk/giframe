/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class CollisionShape {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		this.Type = new DWORD(reader);

		const list = [2, 0, 1];
		for (let i = 0; i < list[this.Type.value]; i++) {
			this.positions.push(new FLOAT(reader, 3));
		}

		if (this.Type.value === 2) {
			this.BoundsRadius = new FLOAT(reader);
		}
	}

	/**
	 * 0 - Box
	 * 1 - ???
	 * 2 - Sphere
	 * @type {DWORD}
	 */
	Type;

	/** @type {FLOAT[]} */
	positions = [];

	write() {
		this.node.write();
		this.Type.write();
		for (const p of this.positions) {
			p.write();
		}
		this.BoundsRadius?.write();
	}
}


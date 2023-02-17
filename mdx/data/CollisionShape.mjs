/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class CollisionShape {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		this.Type = new DWORD(reader);

		let len = 0;
		switch (this.Type.value) {
			case 0:
				len = 2;
				break;
			case 2:
				len = 1;
				break;
		}

		for (let i = 0; i < len; i++) {
			this.positions.push(new VECTOR(reader, 3));
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

	/** @type {VECTOR[]} */
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


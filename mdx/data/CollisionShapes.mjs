import {StructSize} from "../type/StructSize.mjs";
import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

//TODO chunk container
export class CollisionShapes {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.list.push(new CollisionShape(r));
		}
		this.chunkSize.check();
	}

	/** @type {CollisionShape[]} */ list = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const e of this.list) {
			e.write();
		}
		this.chunkSize.write();
	}
}

class CollisionShape {
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


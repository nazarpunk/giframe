import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";

export class Bones {
	/** @param {DWORD} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const end = r.byteOffset + this.ChunkSize.value;

		while (r.byteOffset < end) {
			this.bones.push(new Bone(r));
		}
	}

	/** @type {Bone[]} */
	bones = [];

	write() {
		this.key.write();
		this.ChunkSize.write();
		for (const b of this.bones) {
			b.write();
		}
	}
}

class Bone {
	/** @param {Reader} reader */
	constructor(reader) {
		this.node = new NodeData(reader);
		this.GeosetId = new DWORD(reader);
		this.GeosetAnimationId = new DWORD(reader);
	}

	write() {
		this.node.write();
		this.GeosetId.write();
		this.GeosetAnimationId.write();
	}
}

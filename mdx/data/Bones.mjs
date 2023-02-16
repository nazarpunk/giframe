import {NodeData} from "./NodeData.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class Bones {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.bones.push(new Bone(r));
		}
		this.chunkSize.check();
	}

	/** @type {Bone[]} */
	bones = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const b of this.bones) {
			b.write();
		}
		this.chunkSize.write();
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

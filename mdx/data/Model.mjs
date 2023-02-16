import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {VECTOR} from "../type/VECTOR.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class Model {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		this.Name = new CHAR(r, 80);
		this.AnimationFileName = new CHAR(r, 260);
		this.BoundsRadius = new FLOAT(r);
		this.MinimumExtent = new VECTOR(r, 3);
		this.MaximumExtent = new VECTOR(r, 3);
		this.BlendTime = new DWORD(r);
	}

	write() {
		this.key.write();
		this.chunkSize.save();
		this.Name.write();
		this.AnimationFileName.write();
		this.BoundsRadius.write();
		this.MinimumExtent.write();
		this.MaximumExtent.write();
		this.BlendTime.write();
		this.chunkSize.write();
	}
}

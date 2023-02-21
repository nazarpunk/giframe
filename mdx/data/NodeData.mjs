/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class NodeData {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.ObjectId = new DWORD(reader);
		this.ParentId = new DWORD(reader);
		this.Flags = new DWORD(reader);
		this.translations = InterpolationOld.fromKey(reader, 'KGTR', FLOAT, 3);
		this.rotations = InterpolationOld.fromKey(reader, 'KGRT', FLOAT, 4);
		this.scalings = InterpolationOld.fromKey(reader, 'KGSC', FLOAT, 3);
		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.Name.write();
		this.ObjectId.write();
		this.ParentId.write();
		this.Flags.write();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
		this.inclusiveSize.write();
	}
}


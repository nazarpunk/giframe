/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class NodeData {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Name = new CHAR(reader, 80);
		this.ObjectId = new DWORD(reader);
		this.ParentId = new DWORD(reader);
		this.Flags = new DWORD(reader);
		this.translations = Interpolation.fromKey(reader, 'KGTR', FLOAT, 3);
		this.rotations = Interpolation.fromKey(reader, 'KGRT', FLOAT, 4);
		this.scalings = Interpolation.fromKey(reader, 'KGSC', FLOAT, 3);
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


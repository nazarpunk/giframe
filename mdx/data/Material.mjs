/** @module MDX */

import {DWORD} from "../type/DWORD.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {CHAR} from "../type/CHAR.mjs";
import {CountedList} from "../model/CountedList.js";
import {Layer} from "./Layer.mjs";

export class Material {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.PriorityPlane = new DWORD(reader);
		this.Flags = new DWORD(reader);
		if (reader.version > 800) {
			this.shader = new CHAR(reader, 80);
		}
		this.layers = CountedList.fromKey(reader, 'LAYS', Layer, {count: true});
		this.inclusiveSize.check();
	}

	write() {
		this.inclusiveSize.save();
		this.PriorityPlane.write();
		this.Flags.write();
		this.shader?.write();
		this.layers?.write();
		this.inclusiveSize.write();
	}
}
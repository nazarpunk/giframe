/** @module MDX */

import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";

export class GeosetAnimation {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.Alpha = new FLOAT(reader);
		this.Flags = new DWORD(reader);
		this.Color = new FLOAT(reader, 3);
		this.GeosetId = new DWORD(reader);
		this.AlphaStruct = InterpolationOld.fromKey(reader, 'KGAO', FLOAT);
		this.ColorStruct = InterpolationOld.fromKey(reader, 'KGAC', FLOAT, 3);
	}

	write() {
		this.inclusiveSize.save();
		this.Alpha.write();
		this.Flags.write();
		this.Color.write();
		this.GeosetId.write();
		this.AlphaStruct?.write();
		this.ColorStruct?.write();
		this.inclusiveSize.write();
	}
}

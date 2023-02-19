/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";

export class GeosetAnimation {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Alpha = new FLOAT(reader);
		this.Flags = new DWORD(reader);
		this.Color = new FLOAT(reader, 3);
		this.GeosetId = new DWORD(reader);
		this.AlphaStruct = Interpolation.fromKey(reader, 'KGAO', FLOAT);
		this.ColorStruct = Interpolation.fromKey(reader, 'KGAC', FLOAT, 3);
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

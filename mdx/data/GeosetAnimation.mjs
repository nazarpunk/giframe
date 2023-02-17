/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {FLOAT} from "../type/FLOAT.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";
import {Interpolation} from "../model/Interpolation.mjs";

export class GeosetAnimation {
	/** @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.Alpha = new FLOAT(reader);
		this.Flags = new DWORD(reader);
		this.Color = new FLOAT(reader, 3);
		this.GeosetId = new DWORD(reader);

		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KGAO':
					this.AlphaStruct = new Interpolation(key, FLOAT);
					break;
				case 'KGAC':
					this.ColorStruct = new Interpolation(key, FLOAT, 3);
					break;
				default:
					throw new Error(`GeosetAnimation wrong key: ${key.name}`);
			}
		}
	}

	/**
	 * 1 - DropShadow
	 * 2 - Color
	 * @type {DWORD}
	 */
	Flags;

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

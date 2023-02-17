/** @module MDX */

import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";
import {Interpolation} from "../model/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KTAT':
					this.translations = new Interpolation(key, FLOAT, 3);
					break;
				case 'KTAR':
					this.rotations = new Interpolation(key, FLOAT, 4);
					break;
				case 'KTAS':
					this.scalings = new Interpolation(key, FLOAT, 3);
					break;
				default:
					throw new Error(`TextureAnimation wrong key: ${key.name}`);
			}
		}
		this.inclusiveSize.check();
	}

	/** @type {Interpolation} */ translations;
	/** @type {Interpolation} */ rotations;
	/** @type {Interpolation} */ scalings;

	write() {
		this.inclusiveSize.save();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
		this.inclusiveSize.write();
	}
}

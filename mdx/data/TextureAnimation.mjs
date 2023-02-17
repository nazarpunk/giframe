/** @module MDX */

import {StructSize} from "../type/StructSize.mjs";
import {Interpolation} from "../model/Interpolation.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		this.translations = Interpolation.fromKey(reader, 'KTAT', FLOAT, 3);
		this.rotations = Interpolation.fromKey(reader, 'KTAR', FLOAT, 4);
		this.scalings = Interpolation.fromKey(reader, 'KTAS', FLOAT, 3);
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

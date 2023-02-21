/** @module MDX */

import {StructSizeOld} from "../type/StructSizeOld.mjs";
import {InterpolationOld} from "../parser/InterpolationOld.mjs";
import {FLOAT} from "../type/FLOAT.mjs";

export class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSizeOld(reader, {inclusive: true});
		this.translations = InterpolationOld.fromKey(reader, 'KTAT', FLOAT, 3);
		this.rotations = InterpolationOld.fromKey(reader, 'KTAR', FLOAT, 4);
		this.scalings = InterpolationOld.fromKey(reader, 'KTAS', FLOAT, 3);
		this.inclusiveSize.check();
	}

	/** @type {InterpolationOld} */ translations;
	/** @type {InterpolationOld} */ rotations;
	/** @type {InterpolationOld} */ scalings;

	write() {
		this.inclusiveSize.save();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
		this.inclusiveSize.write();
	}
}

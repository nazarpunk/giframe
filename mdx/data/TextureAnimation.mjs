/** @module MDX */

import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";
import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		while (reader.byteOffset < this.inclusiveSize.end) {
			const key = new KEY(reader);
			switch (key.name) {
				case 'KTAT':
					this.translations = new Translations(key);
					break;
				case 'KTAR':
					this.rotations = new Rotations(key);
					break;
				case 'KTAS':
					this.scalings = new Scalings(key);
					break;
				default:
					throw `TextureAnimation wrong key: ${key.name}`;
			}
		}
		this.inclusiveSize.check();
	}

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;

	write() {
		this.inclusiveSize.save();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
		this.inclusiveSize.write();
	}
}

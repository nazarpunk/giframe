import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";
import {DWORD} from "../type/DWORD.mjs";
import {KEY} from "../type/KEY.mjs";

export class TextureAnimations {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.ChunkSize = new DWORD(r);
		const end = r.byteOffset + this.ChunkSize.value;
		while (r.byteOffset < end) {
			this.animations.push(new TextureAnimation(r));
		}
	}

	/** @type {TextureAnimation[]} */
	animations = [];

	write() {
		this.key.write();
		this.ChunkSize.write();
		for (const a of this.animations) {
			a.write();
		}
	}
}

class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.InclusiveSize = new DWORD(reader);
		const end = reader.byteOffset - 4 + this.InclusiveSize.value;

		parse: while (reader.byteOffset < end) {
			const key = new KEY(reader);
			switch (key.valueName) {
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
					console.error('TextureAnimation:', key.valueName);
					break parse;
			}
		}
	}

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;

	write() {
		this.InclusiveSize.write();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
	}
}

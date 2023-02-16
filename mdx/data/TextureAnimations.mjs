import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";
import {DWORD} from "../type/DWORD.mjs";

export class TextureAnimations {
	/** @param {DWORD} key */
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
			const key = new DWORD(reader, {byteOffset: 0});
			switch (key.valueName) {
				case 'KTAT':
					this.translations = new Translations(new DWORD(reader));
					break;
				case 'KTAR':
					this.rotations = new Rotations(new DWORD(reader));
					break;
				case 'KTAS':
					this.scalings = new Scalings(new DWORD(reader));
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

	write(){
		this.InclusiveSize.write();
		this.translations?.write();
		this.rotations?.write();
		this.scalings?.write();
	}
}

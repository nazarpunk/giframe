import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";
import {KEY} from "../type/KEY.mjs";
import {StructSize} from "../type/StructSize.mjs";

export class TextureAnimations {
	/** @param {KEY} key */
	constructor(key) {
		const r = key.reader;
		this.key = key;
		this.chunkSize = new StructSize(r, {chunk: true});
		while (r.byteOffset < this.chunkSize.end) {
			this.animations.push(new TextureAnimation(r));
		}
		this.chunkSize.check();
	}

	/** @type {TextureAnimation[]} */
	animations = [];

	write() {
		this.key.write();
		this.chunkSize.save();
		for (const a of this.animations) {
			a.write();
		}
		this.chunkSize.write();
	}
}

class TextureAnimation {
	/**  @param {Reader} reader */
	constructor(reader) {
		this.inclusiveSize = new StructSize(reader, {inclusive: true});
		parse: while (reader.byteOffset < this.inclusiveSize.end) {
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

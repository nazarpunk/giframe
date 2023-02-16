import {ModelData} from "../ModelData.mjs";
import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";

export class TextureAnimations extends ModelData {
	/**
	 *  @param key
	 *  @param {MDX} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();

		const end = model.byteOffset + this.ChunkSize;

		while (model.byteOffset < end) {
			this.animations.push(new TextureAnimation(model));
		}
	}

	/** @type {TextureAnimation[]} */
	animations = [];
}

class TextureAnimation {
	/**  @param {MDX} model */
	constructor(model) {
		this.InclusiveSize = model.readDWORD();
		const end = model.byteOffset - 4 + this.InclusiveSize;

		const keyName = model.keyName();
		switch (keyName) {
			case 'KTAT':
				this.translations = new Translations(model.readDWORD(), model);
				break;
			case 'KTAR':
				this.rotations = new Rotations(model.readDWORD(), model);
				break;
			case 'KTAS':
				this.scalings = new Scalings(model.readDWORD(), model);
				break;
			default:
				console.error('TextureAnimation:', keyName);
		}
	}

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;
}

// noinspection DuplicatedCode,JSUnusedGlobalSymbols

import {ModelData} from "../ModelData.mjs";
import {Translations} from "./Translations.mjs";
import {Rotations} from "./Rotations.mjs";
import {Scalings} from "./Scalings.mjs";

export class TextureAnimations extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();

		const end = model.byteOffset + this.ChunkSize;

		while (model.byteOffset < end) {
			this.animations.push(new TextureAnimation(model));
		}
	}

	/** @type {TextureAnimation[]} */
	animations = [];
}

class TextureAnimation {
	/**  @param {Model} model */
	constructor(model) {
		this.InclusiveSize = model.dword();
		const keyName = model.keyName();
		switch (keyName) {
			case 'KTAT':
				this.translations = new Translations(model.dword(), model);
				break;
			case 'KTAR':
				this.rotations = new Rotations(model.dword(), model);
				break;
			case 'KTAS':
				this.scalings = new Scalings(model.dword(), model);
				break;
			default:
				console.error('TextureAnimation Parse Error: ', keyName);
		}
	}

	/** @type {Translations} */ translations;
	/** @type {Rotations} */ rotations;
	/** @type {Scalings} */ scalings;
}

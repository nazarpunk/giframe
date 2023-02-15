// noinspection DuplicatedCode,JSUnusedGlobalSymbols

import {ModelData} from "../ModelData.mjs";
import {TextureTranslations} from "./TextureTranslations.mjs";
import {TextureRotations} from "./TextureRotations.mjs";
import {TextureScalings} from "./TextureScalings.mjs";

export class TextureAnimations extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();

		const end = model.byteOffset + this.ChunkSize;

		let i = 0;
		while (model.byteOffset < end) {
			i++;
			if (i > 20) break;
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
				this.translation = new TextureTranslations(model.dword(), model);
				break;
			case 'KTAR':
				this.rotation = new TextureRotations(model.dword(), model);
				break;
			case 'KTAS':
				this.scaling = new TextureScalings(model.dword(), model);
				break;
			default:
				console.error('TextureAnimation Parse Error: ', keyName);
		}
	}

	/** @type {TextureTranslations} */ translation;
	/** @type {TextureRotations} */ rotation;
	/** @type {TextureScalings} */ scaling;
}

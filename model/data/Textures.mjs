import {ModelData} from "../ModelData.mjs";

export class Textures extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();
		const n = this.ChunkSize / 268;
		for (let i = 0; i < n; i++) {
			this.textures.push(new Texture(model));
		}
	}

	/** @type {Texture[]} */
	textures = [];
}

class Texture {
	/**  @param {Model} model */
	constructor(model) {
		this.ReplaceableId = model.dword();
		this.FileName = model.char(260);
		this.Flags = model.dword();
	}

	/**
	 * 1 - WrapWidth
	 * 2 - WrapHeight
	 * @type {number}
	 */
	Flags;
}
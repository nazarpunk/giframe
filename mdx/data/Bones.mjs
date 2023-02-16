import {ModelData} from "../ModelData.mjs";
import {NodeData} from "./NodeData.mjs";

export class Bones extends ModelData {
	/**
	 *  @param key
	 *  @param {MDX} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();
		const end = model.byteOffset + this.ChunkSize;

		let i = 0;
		while (model.byteOffset < end) {
			i++;
			if (i > 1) break;
			this.bones.push(new Bone(model));
		}
	}

	/** @type {Bone[]} */
	bones = [];
}

class Bone {
	/** @param {MDX} model */
	constructor(model) {
		this.node = new NodeData(model);
		this.GeosetId = model.readDWORD();
		this.GeosetAnimationId = model.readDWORD();
	}
}

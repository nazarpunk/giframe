import {ModelData} from "../ModelData.mjs";

export class PivotPoints extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();
		const num = this.ChunkSize / 12;
		for (let i = 0; i < num; i++) {
			this.points.push([model.float(), model.float(), model.float()]);
		}
	}

	/** @type {[number,number,number][]} */ points = [];
}
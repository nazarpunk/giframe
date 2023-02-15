import {ModelData} from "../ModelData.mjs";

export class PivotPoints extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();
		const num = this.ChunkSize / 12;
		for (let i = 0; i < num; i++) {
			this.points.push([model.readFLOAT(), model.readFLOAT(), model.readFLOAT()]);
		}
	}

	/** @type {[number,number,number][]} */ points = [];
}
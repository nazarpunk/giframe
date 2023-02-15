import {ModelData} from "../ModelData.mjs";

export class GlobalSequences extends ModelData {
	/** @type {GlobalSequence[]} */
	sequences = [];

	/**
	 * @param {number} key
	 * @param {Model} model
	 */
	constructor(key, model) {
		super(key);

		this.ChunkSize = model.dword();

		const n = this.ChunkSize / 4;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new GlobalSequence(model));
		}
	}
}

class GlobalSequence {
	/**  @param {Model} model */
	constructor(model) {
		this.Duration = model.dword();
	}
}
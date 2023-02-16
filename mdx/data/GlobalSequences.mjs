import {ModelData} from "../ModelData.mjs";

export class GlobalSequences extends ModelData {
	/** @type {GlobalSequence[]} */
	sequences = [];

	/**
	 * @param {number} key
	 * @param {MDX} model
	 */
	constructor(key, model) {
		super(key);

		this.ChunkSize = model.readDWORD();

		const n = this.ChunkSize / 4;
		for (let i = 0; i < n; i++) {
			this.sequences.push(new GlobalSequence(model));
		}
	}
}

class GlobalSequence {
	/**  @param {MDX} model */
	constructor(model) {
		this.Duration = model.readDWORD();
	}
}
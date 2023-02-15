export class ModelData {
	/**
	 * @param {number} key
	 * @param {Model} model
	 */
	constructor(key, model) {
		this.key = key;
		this.model = model;
	}

	/** @type {number} */ key;
	/** @type {Model} */ model;
}

export class ModelData {
	/**
	 * @param {number} key
	 * @param {MDX} model
	 */
	constructor(key, model) {
		this.key = key;
		this.model = model;
	}

	/** @type {number} */ key;
	/** @type {MDX} */ model;
}

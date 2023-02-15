import {ModelData} from "../ModelData.mjs";

export class Translations extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.NrOfTracks = model.dword();
		this.InterpolationType = model.dword();
		this.GlobalSequenceId = model.dword();
		for (let i = 0; i < this.NrOfTracks; i++) {
			this.translations.push(new Translation(model, this.InterpolationType));
		}
	}

	/**
	 * 0 - None
	 * 1 - Linear
	 * 2 - Hermite
	 * 3 - Bezier
	 * @type {number}
	 */
	InterpolationType;

	/** @type Translation[] */
	translations = [];
}

class Translation {
	/**
	 * @param {Model} model
	 * @param {number} InterpolationType
	 */
	constructor(model, InterpolationType) {
		this.Time = model.dword();
		this.Translation = [model.float(), model.float(), model.float()];
		if (InterpolationType > 1) {
			this.InTan = [model.float(), model.float(), model.float()];
			this.OutTan = [model.float(), model.float(), model.float()];
		}
	}
}

import {ModelData} from "../ModelData.mjs";

export class TextureScalings extends ModelData {
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
			this.scalings.push(new TextureScaling(model, this.InterpolationType));
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

	/** @type TextureScaling[] */ scalings = [];
}

class TextureScaling {
	/**
	 * @param {Model} model
	 * @param {number} InterpolationType
	 */
	constructor(model, InterpolationType) {
		this.Time = model.dword();
		this.Scaling = [model.float(), model.float(), model.float()];
		if (InterpolationType > 1) {
			this.InTan = [model.float(), model.float(), model.float()];
			this.OutTan = [model.float(), model.float(), model.float()];
		}
	}
}

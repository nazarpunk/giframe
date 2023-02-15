import {ModelData} from "../ModelData.mjs";

export class TextureRotations extends ModelData {
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
			this.rotations.push(new TextureRotation(model, this.InterpolationType));
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

	/** @type TextureRotation[] */ rotations = [];
}

class TextureRotation {
	/**
	 * @param {Model} model
	 * @param {number} InterpolationType
	 */
	constructor(model, InterpolationType) {
		this.Time = model.dword();
		this.Rotation = [model.float(), model.float(), model.float(), model.float()];
		if (InterpolationType > 1) {
			this.InTan = [model.float(), model.float(), model.float(), model.float()];
			this.OutTan = [model.float(), model.float(), model.float(), model.float()];
		}
	}
}
import {ModelData} from "../ModelData.mjs";

export class Rotations extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.NrOfTracks = model.readDWORD();
		this.InterpolationType = model.readDWORD();
		this.GlobalSequenceId = model.readDWORD();
		for (let i = 0; i < this.NrOfTracks; i++) {
			this.rotations.push(new Rotation(model, this.InterpolationType));
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

	/** @type Rotation[] */ rotations = [];
}

class Rotation {
	/**
	 * @param {Model} model
	 * @param {number} InterpolationType
	 */
	constructor(model, InterpolationType) {
		this.Time = model.readDWORD();
		this.Rotation = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		if (InterpolationType > 1) {
			this.InTan = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
			this.OutTan = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		}
	}
}
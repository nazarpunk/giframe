import {ModelData} from "../ModelData.mjs";

export class Scalings extends ModelData {
	/**
	 *  @param key
	 *  @param {MDX} model
	 */
	constructor(key, model) {
		super(key);
		this.NrOfTracks = model.readDWORD();
		this.InterpolationType = model.readDWORD();
		this.GlobalSequenceId = model.readDWORD();
		for (let i = 0; i < this.NrOfTracks; i++) {
			this.scalings.push(new Scaling(model, this.InterpolationType));
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

	/** @type Scaling[] */ scalings = [];
}

class Scaling {
	/**
	 * @param {MDX} model
	 * @param {number} InterpolationType
	 */
	constructor(model, InterpolationType) {
		this.Time = model.readDWORD();
		this.Scaling = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		if (InterpolationType > 1) {
			this.InTan = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
			this.OutTan = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		}
	}
}

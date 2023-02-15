import {ModelData} from "../ModelData.mjs";

export class ModelInfo extends ModelData {

	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key, model);
		this.ChunkSize = model.readDWORD();
		this.Name = model.readCHAR(80);
		this.AnimationFileName = model.readCHAR(260);
		this.BoundsRadius = model.readFLOAT();
		this.MinimumExtent = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		this.MaximumExtent = [model.readFLOAT(), model.readFLOAT(), model.readFLOAT()];
		this.BlendTime = model.readDWORD();
	}

	write() {
		const m = this.model;
		m.writeDWORD(this.key);
		m.writeDWORD(this.ChunkSize);
		m.writeCHAR(this.Name, 80);
		m.writeCHAR(this.AnimationFileName, 260);
		m.writeFLOAT(this.BoundsRadius);
		for (const f of this.MinimumExtent) {
			m.writeFLOAT(f);
		}
		for (const f of this.MaximumExtent) {
			m.writeFLOAT(f);
		}
		m.writeDWORD(this.BlendTime);
	}
}

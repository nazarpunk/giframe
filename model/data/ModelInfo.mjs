import {ModelData} from "../ModelData.mjs";

export class ModelInfo extends ModelData {

	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key, model);
		this.ChunkSize = model.readDWORD();
		this.Name = model.char(80);
		this.AnimationFileName = model.char(260);
		this.BoundsRadius = model.float();
		this.MinimumExtent = [model.float(), model.float(), model.float()];
		this.MaximumExtent = [model.float(), model.float(), model.float()];
		this.BlendTime = model.readDWORD();
	}

	save() {
		this.model.writeDWORD(this.key);
		this.model.writeDWORD(this.ChunkSize);
	}
}

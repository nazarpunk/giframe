import {ModelData} from "../ModelData.mjs";

export class ModelInfo extends ModelData {

	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.dword();
		this.Name = model.char(80);
		this.AnimationFileName = model.char(260);
		this.BoundsRadius = model.float();
		this.MinimumExtent = [model.float(), model.float(), model.float()];
		this.MaximumExtent = [model.float(), model.float(), model.float()];
		this.BlendTime = model.dword();
	}
}

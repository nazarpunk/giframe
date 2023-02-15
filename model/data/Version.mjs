import {ModelData} from "../ModelData.mjs";

export class Version extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key);
		this.ChunkSize = model.readDWORD();
		this.version = model.readDWORD();
	}
	save(){

	}
}

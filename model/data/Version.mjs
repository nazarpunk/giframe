import {ModelData} from "../ModelData.mjs";

export class Version extends ModelData {
	/**
	 *  @param key
	 *  @param {Model} model
	 */
	constructor(key, model) {
		super(key, model);
		this.ChunkSize = model.readDWORD();
		this.version = model.readDWORD();
	}

	write() {
		this.model.writeDWORD(this.key);
		this.model.writeDWORD(this.ChunkSize);
		this.model.writeDWORD(this.version);
	}
}

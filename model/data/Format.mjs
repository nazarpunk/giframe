import {ModelData} from "../ModelData.mjs";

export class Format extends ModelData {
	save() {
		this.model.writeDWORD(this.key);
	}
}
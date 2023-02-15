import {ModelData} from "../ModelData.mjs";

export class Format extends ModelData {
	write() {
		this.model.writeDWORD(this.key);
	}
}
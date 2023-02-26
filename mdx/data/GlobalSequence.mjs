import {ParserOld} from "../parser/ParserOld.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class GlobalSequence {
	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();
		this.duration = this.parser.add(Uint32);
		this.parser.read(view);
	}

	toJSON() {
		return this.duration.toJSON();
	}
}
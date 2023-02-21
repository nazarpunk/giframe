import {Parser} from "../parser/Parser.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class GlobalSequence {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);
		this.duration = this.parser.add(Uint32);
		this.parser.read();
	}

	toJSON() {
		return this.duration.toJSON();
	}
}
/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Float32List} from "../parser/Float.mjs";

export class PivotPoint {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);
		this.point = this.parser.add(new Float32List(3));
		this.parser.read();
	}

	toJSON() {
		return this.point.toJSON();
	}
}
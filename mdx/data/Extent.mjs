import {Parser} from "../parser/Parser.mjs";
import {Float32, Float32List} from "../parser/Float.mjs";

/** @module MDX */
export class Extent {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.boundsRadius = this.parser.add(Float32);
		this.minimum = this.parser.add(new Float32List(3));
		this.maximum = this.parser.add(new Float32List(3));

		this.parser.read();
	}

	toJSON() {
		return {
			boundsRadius: this.boundsRadius,
			minimum: this.minimum,
			maximum: this.maximum,
		};
	}
}

/** @module MDX */
import {Parser} from "../parser/Parser.mjs";
import {Char} from "../parser/Char.mjs";

export class FaceEffect {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.target = this.parser.add(new Char(80));
		this.path = this.parser.add(new Char(260));

		this.parser.read();
	}

	toJSON() {
		return {
			target: this.target,
			path: this.path,
		}
	}
}

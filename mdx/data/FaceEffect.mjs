/** @module MDX */
import {ParserOld} from "../parser/ParserOld.mjs";
import {Char} from "../parser/Char.mjs";

export class FaceEffect {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new ParserOld(this.reader);

		this.target = this.parser.add(new Char(80));
		this.path = this.parser.add(new Char(260));

		this.parser.read(view);
	}

	toJSON() {
		return {
			target: this.target,
			path: this.path,
		}
	}
}

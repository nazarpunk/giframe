/** @module MDX */
import {Char} from "../parser/Char.mjs";

export class FaceEffect {
	/** @param {DataView} view */
	read(view) {
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

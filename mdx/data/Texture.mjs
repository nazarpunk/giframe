/** @module MDX */

import {Uint32} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";
import {Parser} from "../parser/Parser.mjs";

export class Texture {
	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();

		this.replaceableId = this.parser.add(Uint32);
		this.fileName = this.parser.add(new Char(260));
		this.flags = this.parser.add(Uint32);

		this.parser.read(view);
	}

	toJSON() {
		return {
			replaceableId: this.replaceableId,
			fileName: this.fileName,
			flags: this.flags,
		}
	}
}
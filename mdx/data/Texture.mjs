/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";

export class Texture {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.replaceableId = this.parser.add(Uint32);
		this.fileName = this.parser.add(new Char(260));
		this.flags = this.parser.add(Uint32);

		this.parser.read();
	}

	toJSON() {
		return {
			replaceableId: this.replaceableId,
			fileName: this.fileName,
			flags: this.flags,
		}
	}
}
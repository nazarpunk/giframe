/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {Float32List} from "../parser/Float32List.mjs";

export class TextureAnimation {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.translations = this.parser.add(new Interpolation(0x5441544b/*KTAT*/, Float32List, 3));
		this.rotations = this.parser.add(new Interpolation(0x5241544b/*KTAR*/, Float32List, 4));
		this.scalings = this.parser.add(new Interpolation(0x5341544b/*KTAS*/, Float32List, 3));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			translations: this.translations,
			rotations: this.rotations,
			scalings: this.scalings,
		}
	}
}

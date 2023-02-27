/** @module MDX */

import {Uint32} from "../parser/Uint.mjs";
import {Char} from "../parser/Char.mjs";
import {Parser} from "../parser/Parser.mjs";
import {ChunkCountInclusive} from "../parser/ChunkCountInclusive.mjs";
import {Chunk} from "../parser/Chunk.mjs";
import {Layer} from "./Layer.mjs";

export class Material {

	/** @type {Vers} */ vers;

	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser(this.vers);

		this.priorityPlane = this.parser.add(Uint32);
		this.flags = this.parser.add(Uint32);

		if (this.vers.version > 800) {
			this.shader = this.parser.add(new Char(80));
		}

		this.layers = this.parser.add(new ChunkCountInclusive(Chunk.LAYS, Layer));

		this.parser.read(view);
	}

	toJSON() {
		return {
			priorityPlane: this.priorityPlane,
			flags: this.flags,
			shader: this.shader,
			layers: this.layers,
		}
	}
}
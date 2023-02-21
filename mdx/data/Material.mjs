/** @module MDX */

import {Layer} from "./Layer.mjs";
import {Parser} from "../parser/Parser.mjs";
import {ChunkSize, InclusiveSize} from "../parser/StructSize.mjs";
import {Uint32} from "../parser/Uint32.mjs";
import {Char} from "../parser/Char.mjs";
import {ChunkList} from "../parser/ChunkList.mjs";

export class Material {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.priorityPlane = this.parser.add(Uint32);
		this.flags = this.parser.add(Uint32);

		if (this.reader.version > 800) {
			this.shader = this.parser.add(new Char(80));
		}
		this.layers = this.parser.add(new ChunkList(0x5359414c/*LAYS*/, Layer));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			priorityPlane: this.priorityPlane,
			flags: this.flags,
			shader: this.shader,
			layers: this.layers,
		}
	}
}
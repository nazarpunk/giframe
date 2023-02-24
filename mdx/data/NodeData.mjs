/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Char} from "../parser/Char.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {Float32List} from "../parser/Float.mjs";

export class NodeData {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.name = this.parser.add(new Char(80));
		this.objectId = this.parser.add(Uint32);
		this.parentId = this.parser.add(Uint32);
		this.flags = this.parser.add(Uint32);
		this.translation = this.parser.add(new Interpolation(0x5254474b/*KGTR*/, Float32List, 3));
		this.rotation = this.parser.add(new Interpolation(0x5452474b/*KGRT*/, Float32List, 4));
		this.scaling = this.parser.add(new Interpolation(0x4353474b/*KGSC*/, Float32List, 3));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			name: this.name,
			objectId: this.objectId,
			parentId: this.parentId,
			flags: this.flags,
			translation: this.translation,
			rotation: this.rotation,
			scaling: this.scaling,
		}
	}
}
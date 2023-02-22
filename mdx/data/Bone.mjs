/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {Uint32} from "../parser/Uint.mjs";

export class Bone {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.node = this.parser.add(NodeData);
		this.geosetId = this.parser.add(Uint32);
		this.geosetAnimationId = this.parser.add(Uint32);

		this.parser.read();
	}

	toJSON() {
		return {
			node: this.node,
			geosetId: this.geosetId,
			geosetAnimationId: this.geosetAnimationId,
		}
	}
}

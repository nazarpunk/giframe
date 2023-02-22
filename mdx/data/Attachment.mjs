/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {InclusiveSize} from "../parser/StructSize.mjs";
import {Char} from "../parser/Char.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Interpolation} from "../parser/Interpolation.mjs";
import {Float32} from "../parser/Float32.mjs";

export class Attachment {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.inclusiveSize = this.parser.add(InclusiveSize);
		this.node = this.parser.add(NodeData);
		this.path = this.parser.add(new Char(260));
		this.attachmentId = this.parser.add(Uint32);
		this.visibility = this.parser.add(new Interpolation(0x5654414b/*KATV*/, Float32));

		this.parser.read();
	}

	toJSON() {
		return {
			inclusiveSize: this.inclusiveSize,
			node: this.node,
			path: this.path,
			attachmentId: this.attachmentId,
			visibility: this.visibility,
		}
	}
}

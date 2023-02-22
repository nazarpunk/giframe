/** @module MDX */

import {NodeData} from "./NodeData.mjs";
import {Parser} from "../parser/Parser.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Float32List} from "../parser/Float32List.mjs";

export class CollisionShape {
	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.node = this.parser.add(NodeData);
		this.type = this.parser.add(Uint32);

		this.parser.read();

		this.parser2 = new Parser(this.reader);

		const t = this.type.value;

		const l = t === 2 ? 1 : 2;
		for (let i = 0; i < 3; i++) {
			this.vertices.push(this.parser2.add(new Float32List(l)));
		}

		if (t === 2 || t === 3) {
			this.radius = this.parser2.add(Uint32);
		}

		this.parser2.read();
	}

	//FIXME write length
	/** @type {Float32List[]} */ vertices = [];

	write() {
		this.parser.write();
		this.parser2.write();
	}

	toJSON() {
		return {
			node: this.node,
			type: this.type,
			radius: this.radius,
		}
	}
}

/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Key} from "../parser/Key.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Float32List} from "../parser/Float.mjs";

export class TextureCoordinateSet {
	/** @type {Reader} reader */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.key = this.parser.add(new Key(0x53425655/*UVBS*/));
		this.count = this.parser.add(Uint32);

		this.parser.read();

		this.parser2 = new Parser(this.reader);

		for (let i = 0; i < this.count.value; i++) {
			this.sets.push(this.parser2.add(new Float32List(2)));
		}

		this.parser2.read();
	}

	/** @type {Float32List[]} */  sets = [];

	write() {
		this.parser.write();
		this.parser2.write();
	}

	toJSON() {
		return {
			key: this.key,
			count: this.count,
			sets: this.sets,
		}
	}
}

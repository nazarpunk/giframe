/** @module MDX */

import {Parser} from "../parser/Parser.mjs";
import {Uint32} from "../parser/Uint.mjs";
import {Key} from "../parser/Key.mjs";
import {Float32List} from "../parser/Float.mjs";

export class BindPose {
	static id = 0x534f5042; //*BPOS*

	/** @type {Reader} */ reader;

	read() {
		this.parser = new Parser(this.reader);

		this.key = this.parser.add(new Key(BindPose.id));
		this.count = this.parser.add(Uint32);

		this.parser.read();

		this.parser2 = new Parser(this.reader);
		this.items = this.parser2.add(new Float32List(this.count.value / 4));
		this.parser2.read();
	}

	write() {
		this.parser.write();
		this.parser2.write();
	}

	toJSON() {
		return {
			count: this.count,
			items: this.items,
		}
	}
}

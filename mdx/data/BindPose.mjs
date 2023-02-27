/** @module MDX */

import {Uint32} from "../parser/Uint.mjs";
import {Float32List} from "../parser/Float.mjs";
import {Parser} from "../parser/Parser.mjs";

export class BindPose {
	static id = 0x534f5042; // BPOS

	/** @param {DataView} view */
	read(view) {
		this.parser = new Parser();

		this.key = this.parser.add(new Key(BindPose.id));
		this.count = this.parser.add(Uint32);

		this.parser.read(view);

		this.parser2 = new ParserOld(this.reader);
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

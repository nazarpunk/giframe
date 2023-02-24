import {Parser} from "./Parser.mjs";
import {Key} from "./Key.mjs";
import {Uint32} from "./Uint.mjs";

/** @module MDX */
export class CountList {
	/**
	 * @param {?number} id
	 * @param child
	 */
	constructor(id, child) {
		this.id = id;
		this.child = child;
	}

	/** @type {Reader} */ reader;
	child;

	items = [];

	read() {
		this.parser = new Parser(this.reader);
		if (this.id) {
			this.key = this.parser.add(new Key(this.id));
		}
		this.length = this.parser.add(Uint32);
		this.parser.read();

		for (let i = 0; i < this.length.value; i++) {
			const p = Parser.copyChild(this.child);
			this.items.push(p);
			p.reader = this.reader;
			p.read();
		}
	}

	write() {
		this.parser.write();
		for (const p of this.items) {
			Parser.writeCall(p);
		}
		this.reader.setUint(this.length.size, this.items.length, this.length.writeOffsetCurrent);
	}

	toJSON() {
		return {
			key: this.key,
			length: this.length,
			items: this.items,
		}
	};
}
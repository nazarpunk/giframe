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

	copy() {
		return new CountList(this.id, this.child);
	}

	/** @type {Reader} */ reader;
	child;

	items = [];

	read() {
		const p = new Parser(this.reader);
		if (this.id) {
			this.key = p.add(new Key(this.id));
		}
		this.length = p.add(Uint32);
		p.read();

		for (let i = 0; i < this.length.value; i++) {
			let p;
			if (typeof this.child === 'object') {
				p = this.child.copy();
			} else {
				p = new this.child(this.reader);
			}
			this.items.push(p);
			p.reader = this.reader;
			p.read();
		}
	}

	write() {
		this.key?.write();
		const start = this.reader.output.byteLength;
		this.length.write();
		for (const p of this.items) {
			if (p.write) {
				p.write();
			} else {
				p.parser.write();
			}
		}
		this.reader.updateUint32(this.items.length, start);
	}

	toJSON() {
		return {
			key: this.key,
			length: this.length,
			items: this.items,
		}
	};
}
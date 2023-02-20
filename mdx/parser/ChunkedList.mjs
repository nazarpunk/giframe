import {Key} from "../type/KEY.mjs";
import {Uint32} from "./Uint32.mjs";
import {Parser} from "./Parser.mjs";

/** @module MDX */
export class ChunkedList {
	/**
	 * @param {number} id
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
		const p = new Parser(this.reader);
		this.key = p.add(new Key(this.id));
		this.size = p.add(Uint32);
		p.read();
		this.byteEnd = this.reader.byteOffset + this.size.value - 4;

		while (this.reader.byteOffset < this.byteEnd) {
			const o = this.reader.byteOffset;
			const c = new this.child(this.reader);
			this.items.push(c);
			c.read();
			if (o === this.reader.byteOffset) {
				console.error('ChunkedList infinity read!');
				break;
			}
		}
	}

	write() {
		this.key.write();
		const start = this.reader.output.byteLength;
		this.size.write();
		for (const p of this.items) {
			if (p.write) {
				p.write();
			} else {
				p.parser.write();
			}
		}
		this.reader.updateUint32(this.reader.output.byteLength - start - 4, start);
	}

	toJSON() {
		return {
			key: this.key,
			items: this.items,
		}
	};
}
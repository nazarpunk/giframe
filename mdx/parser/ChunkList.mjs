/** @module MDX */
import {Uint32} from "./Uint.mjs";
import {Parser} from "./Parser.mjs";
import {Key} from "./Key.mjs";

export class ChunkList {
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

		this.byteEnd = this.reader.readOffset + this.size.value;

		while (this.reader.readOffset < this.byteEnd) {
			const o = this.reader.readOffset;
			const p = new this.child(this.reader);

			this.items.push(p);
			p.reader = this.reader;
			p.read();
			if (o === this.reader.readOffset) {
				throw new Error('ChunkList infinity read!');
			}
		}

		if (this.reader.readOffset - this.byteEnd !== 0) {
			throw new Error(`ChunkList end error: ${this.byteEnd} != ${this.reader.readOffset}`);
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
			size: this.size,
			items: this.items,
		}
	};
}
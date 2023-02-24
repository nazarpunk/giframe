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
		this.parser = new Parser(this.reader);
		this.key = this.parser.add(new Key(this.id));
		this.size = this.parser.add(Uint32);
		this.parser.read();
		this.readOffsetEnd = this.reader.readOffset + this.size.value;

		while (this.reader.readOffset < this.readOffsetEnd) {
			const o = this.reader.readOffset;
			const p = new this.child();
			this.items.push(p);
			p.reader = this.reader;
			p.read();
			if (o === this.reader.readOffset) {
				throw new Error('ChunkList infinity read!');
			}
		}

		if (this.reader.readOffset - this.readOffsetEnd !== 0) {
			throw new Error(`ChunkList end error: ${this.readOffsetEnd} != ${this.reader.readOffset}`);
		}
	}

	write() {
		this.parser.write();
		for (const p of this.items) {
			Parser.writeCall(p);
		}
		if (0) {
			//const start = this.reader.output.byteLength;
		}
		//this.reader.writeView.setUint32()

		//this.reader.updateUint32(this.reader.output.byteLength - start - 4, start);
	}

	toJSON() {
		return {
			key: this.key,
			size: this.size,
			items: this.items,
		}
	};
}
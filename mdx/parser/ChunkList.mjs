/** @module MDX */
import {Uint32} from "./Uint.mjs";
import {ParserOld} from "./ParserOld.mjs";
import {Key} from "./Key.mjs";
import {Reader} from "./Reader.mjs";

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
		this.parser = new ParserOld(this.reader);
		this.key = this.parser.add(new Key(this.id));
		this.size = this.parser.add(Uint32);
		this.parser.read(view);

		const end = this.reader.readOffset + this.size.value;

		while (this.reader.readOffset < end) {
			const o = this.reader.readOffset;
			const p = new this.child();
			this.items.push(p);
			p.reader = this.reader;
			p.read();
			if (o === this.reader.readOffset) {
				throw new Error('ChunkList infinity read!');
			}
		}

		if (this.reader.readOffset - end !== 0) {
			throw new Error(`ChunkList end error: ${end} != ${this.reader.readOffset}`);
		}
	}

	write() {
		this.parser.write();
		for (const p of this.items) {
			ParserOld.writeCall(p);
		}
		this.reader.setUint(this.size.size, this.reader.writeOffset - this.size.writeOffsetCurrent - this.size.size, this.size.writeOffsetCurrent);
	}

	toJSON() {
		return {
			key: this.key,
			size: this.size,
			items: this.items,
		}
	};
}
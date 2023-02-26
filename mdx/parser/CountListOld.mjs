import {ParserOld} from "./ParserOld.mjs";
import {Key} from "./Key.mjs";
import {Uint32} from "./Uint.mjs";
import {Reader} from "./Reader.mjs";

/** @module MDX */
export class CountListOld {
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
		this.parser = new ParserOld(this.reader);
		if (this.id) {
			this.key = this.parser.add(new Key(this.id));
		}
		this.length = this.parser.add(Uint32);
		this.parser.read(view);

		for (let i = 0; i < this.length.value; i++) {
			const p = ParserOld.copyChild(this.child);
			this.items.push(p);
			p.reader = this.reader;
			p.read();
		}
	}

	write() {
		this.parser.write();
		for (const p of this.items) {
			ParserOld.writeCall(p);
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
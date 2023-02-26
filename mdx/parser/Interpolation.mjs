/** @module MDX */
import {ParserOld} from "./ParserOld.mjs";
import {Key} from "./Key.mjs";
import {Uint32} from "./Uint.mjs";

export class Interpolation {
	/** @type {Reader} */ reader;

	/**
	 * @param {number} id
	 * @param child
	 * @param {*?} count
	 */
	constructor(id, child, count) {
		this.id = id;
		this.child = child;
		this.count = count;
	}

	items = [];

	read() {
		this.parser = new ParserOld(this.reader);
		this.key = this.parser.add(new Key(this.id));
		this.length = this.parser.add(Uint32);
		this.type = this.parser.add(Uint32);
		this.globalSequenceId = this.parser.add(Uint32);
		this.parser.read(view);

		for (let i = 0; i < this.length.value; i++) {
			const p = new InterpolationTrack(this);
			this.items.push(p);
			p.read();
		}
	}

	write() {
		this.parser.write();
		for (const p of this.items) {
			p.parser.write();
		}
		this.reader.setUint(this.length.size, this.items.length, this.length.writeOffsetCurrent);
	}

	toJSON() {
		return {
			key: this.key,
			length: this.length,
			type: this.type,
			items: this.items,
			globalSequenceId: this.globalSequenceId
		}
	}
}

export class InterpolationTrack {
	/** @param {Interpolation} parent */
	constructor(parent) {
		this.parent = parent;
	}

	read() {
		this.parser = new ParserOld(this.parent.reader);

		this.time = this.parser.add(Uint32);

		const add = () => {
			const p = new this.parent.child(this.parent.count);
			p.reader = this.parent.reader;
			this.parser.add(p);
			return p;
		};

		this.value = add();

		if (this.parent.type.value > 1) {
			this.inTan = add();
			this.outTan = add();
		}

		this.parser.read(view);
	}

	toJSON() {
		return {
			time: this.time,
			value: this.value,
			inTan: this.inTan,
			outTan: this.outTan,
		}
	}
}

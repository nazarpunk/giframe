/** @module MDX */
import {Parser} from "./Parser.mjs";
import {Key} from "./Key.mjs";
import {Uint32} from "./Uint.mjs";

export class Interpolation {
	/** @type {Reader} */ reader;

	/**
	 * @param {number} id
	 * @param child
	 * @param {*?} length
	 */
	constructor(id, child, length) {
		this.id = id;
		this.child = child;
		this.length = length;
	}

	items = [];

	read() {
		const p = new Parser(this.reader);
		this.key = p.add(new Key(this.id));
		this.length = p.add(Uint32);
		this.type = p.add(Uint32);
		this.globalSequenceId = p.add(Uint32);
		p.read();

		for (let i = 0; i < this.length.value; i++) {
			const p = new InterpolationTrack(this);
			this.items.push(p);
			p.read();
		}
	}

	write() {
		this.key.write();
		this.length.write();
		this.type.write();
		for (const p of this.items) {
			p.parser.write();
		}
	}

	toJSON() {
		return {
			key: this.key,
			length: this.length,
			type: this.type,
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
		this.parser = new Parser(this.parent.reader);

		this.time = this.parser.add(new Uint32());
		this.value = this.parser.add(this.parent.child);
		if (this.parent.type.value > 1) {
			this.inTan = new this.parent.child(this.parent.length);
			this.outTan = new this.parent.child(this.parent.length);
		}

		this.parser.read();
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

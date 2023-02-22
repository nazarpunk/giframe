/** @module MDX */
import {Parser} from "./Parser.mjs";
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
		const start = this.reader.output.byteLength;
		this.length.write();
		this.type.write();
		this.globalSequenceId.write();
		for (const p of this.items) {
			p.parser.write();
		}
		this.reader.updateUint32(this.items.length, start);
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
		this.parser = new Parser(this.parent.reader);

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

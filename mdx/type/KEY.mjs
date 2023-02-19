/** @module MDX */
import {hex2s} from "./hex.mjs";

export class KEY {
	/**
	 * @param {Reader} reader
	 * @param {string?} name
	 * @param {number} offset
	 */
	constructor(reader, {name, offset = 4} = {}) {
		this.reader = reader;
		const view = this.reader.view;
		this.value = view.getUint32(reader.byteOffset, true);
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(view.getUint8(reader.byteOffset + i)));
		}
		this.name = s.join('');
		this.reader.byteOffset += offset;

		if (offset > 0) {
			console.log('key', this.name, offset);
		}

		if (name && this.name !== name) {
			throw new Error(`KEY ${name} not equal ${this.name}`);
		}
	}

	/** @type {number} */ value;
	/** @type {string} */ name;

	write() {
		this.reader.outputView(4).setUint32(0, this.value, true);
	}

	/** @param {number} int */
	writeInt(int) {
		this.reader.outputView(4).setUint32(0, int, true);
	}
}


export class Key {
	/** @param {number} key */
	constructor(key) {
		this.key = key;
	}

	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getUint32();
		this.reader.moveUint32();
		if (this.value !== this.key) {
			console.error(`Key error ${this.key} != ${this.value}`);
		}

	}

	write() {
		this.reader.setUint32(this.value);
	}

	toJSON() {
		return {
			value: this.value,
			name: hex2s(this.value),
		}
	}
}
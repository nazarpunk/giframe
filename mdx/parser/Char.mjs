/** @module MDX */

export class Char {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	copy() {
		return new Char(this.length);
	}

	/** @type {Reader} */ reader;

	value = '';

	read() {
		this.value = this.reader.readString(this.length);
		this.reader.readOffsetAdd(this.length);
	}

	write() {
		this.reader.writeString(this.length, this.value);
	}

	toJSON() {
		return this.value;
	}
}
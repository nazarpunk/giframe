/** @module MDX */
export class Float32 {
	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.readFloat(4);
		this.reader.readOffsetAdd(4);
	}

	write() {
		this.reader.writeFloat(4, this.value);
	}

	toJSON() {
		return this.value;
	}
}

/** @module MDX */
export class Float32List {
	/** @param {number} length */
	constructor(length = 1) {
		this.length = length;
	}

	copy() {
		return new Float32List(this.length);
	}

	/** @type {Reader} */ reader;
	/** @type {number[]} */ list = [];

	read() {
		for (let i = 0; i < this.length; i++) {
			this.list.push(this.reader.readFloat(4));
			this.reader.readOffsetAdd(4);
		}
	}

	write() {
		for (let i = 0; i < this.length; i++) {
			this.reader.writeFloat(4, this.list[i]);
		}
	}

	toJSON() {
		return this.list;
	}
}
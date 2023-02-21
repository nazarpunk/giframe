/** @module MDX */

export class StructSize {

	/** @param {number} offset */
	constructor(offset) {
		this.offset = offset;
	}

	/** @type {Reader} */ reader;

	/** @type number */
	value;

	read() {
		this.value = this.reader.getUint32();
		this.reader.next32();
	}

	/** @param {number} value */
	write(value) {
		this.reader.setUint32(value);
	}

	toJSON() {
		return this.value;
	}
}

export class ChunkSize extends StructSize {
	constructor() {
		super(-4);
	}
}

export class InclusiveSize extends StructSize {
	constructor() {
		super(0);
	}
}
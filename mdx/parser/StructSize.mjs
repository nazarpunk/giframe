/** @module MDX */

export class StructSize {
	/** @type {Reader} */ reader;

	/** @param {number} offset */
	constructor(offset) {
		this.offset = offset;
	}

	/** @type {number} */ readOffsetCurrentEnd;
}

export class ChunkSize extends StructSize {
	constructor() {
		super(4);
	}
}

export class InclusiveSize extends StructSize {
	constructor() {
		super(0);
	}
}
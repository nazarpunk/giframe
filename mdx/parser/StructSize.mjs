/** @module MDX */
import {Uint} from "./Uint.mjs";

export class StructSize extends Uint {
	/** @type {Reader} */ reader;

	/** @param {number} offset */
	constructor(offset) {
		super(4);
		this.offset = offset;
	}
	/** @type {number} */ readOffsetEnd;
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
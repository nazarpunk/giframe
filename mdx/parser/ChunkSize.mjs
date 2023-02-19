/** @module MDX */

export class ChunkSize {
	/** @type {Reader} */ reader;

	/** @type number */
	value;

	read() {
		this.reader.moveUint32();
	}

	/** @param {number} value */
	write(value) {
		this.reader.setUint32(value);
	}

	toJSON() {
		return this.value;
	}
}

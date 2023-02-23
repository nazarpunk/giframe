/** @module MDX */
export class Float32 {
	/** @type {Reader} */ reader;

	read() {
		this.value = this.reader.getFloat32();
		this.reader.readOffsetAdd(4);
	}

	write() {
		this.reader.outputView(4).setFloat32(0, this.value, true);
	}

	toJSON() {
		return this.value;
	}
}
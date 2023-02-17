/** @module MDX */

export class BYTE {
	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
		this.value = reader.view.getUint8(reader.byteOffset);
		this.reader.byteOffset += 1;
	}

	write() {
		this.reader.outputView(1).setUint8(0, this.value);
	}
}
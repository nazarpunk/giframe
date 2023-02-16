export class BYTE {
	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
		this.value = reader.view.getUint8(reader.byteOffset);
		reader.byteOffset += 1;
	}

	/** @type {number} */ value;

	write() {
		this.reader.outputView(1).setUint8(0, this.value);
	}
}
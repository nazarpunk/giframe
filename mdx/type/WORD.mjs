export class WORD {
	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
		this.value = reader.view.getUint16(reader.byteOffset, true);
		this.reader.byteOffset += 2;
	}

	/** @type {number} */ value;

	write() {
		this.reader.outputView(2).setUint16(0, this.value, true);
	}
}
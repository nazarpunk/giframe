export class DWORD {
	/** @param {Reader} reader */
	constructor(reader) {
		this.reader = reader;
		this.value = this.reader.view.getUint32(reader.byteOffset, true);
		this.reader.byteOffset += 4;
	}

	/** @type {number} */ value;

	write() {
		this.reader.outputView(4).setUint32(0, this.value, true);
	}

	/** @param {number} value */
	writeValue(value) {
		this.value = value;
		this.write();
	}
}
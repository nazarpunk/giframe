export class DWORD {
	/**
	 * @param {Reader} reader
	 * @param {number} byteOffset
	 */
	constructor(reader, {byteOffset = 4} = {}) {
		this.reader = reader;
		const view = this.reader.view;
		this.value = view.getUint32(reader.byteOffset, true);
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(view.getUint8(reader.byteOffset + i)));
		}
		this.valueName = s.join('');
		reader.byteOffset += byteOffset;
	}

	/** @type {number} */ value;
	/** @type {string} */ valueName;

	write() {
		this.reader.outputView(4).setUint32(0, this.value, true);
	}

	/** @param {number} value */
	writeValue(value) {
		this.value = value;
		this.write();
	}
}
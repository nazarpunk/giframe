export class KEY {
	/**
	 * @param {Reader} reader
	 * @param {number} byteOffset
	 * @param {string?} valueName
	 */
	constructor(reader, {byteOffset = 4, valueName} = {}) {
		this.reader = reader;
		const view = this.reader.view;
		this.value = view.getUint32(reader.byteOffset, true);
		const s = [];
		for (let i = 0; i < 4; i++) {
			s.push(String.fromCharCode(view.getUint8(reader.byteOffset + i)));
		}
		this.valueName = s.join('');
		this.reader.byteOffset += byteOffset;

		if (valueName && this.valueName !== valueName) {
			console.error('DWORD valueName:', valueName, this.valueName);
		}
	}

	/** @type {number} */ value;
	/** @type {string} */ valueName;

	write() {
		this.reader.outputView(4).setUint32(0, this.value, true);
	}

	/** @param {number} int */
	writeInt(int) {
		this.reader.outputView(4).setUint32(0, int, true);
	}
}